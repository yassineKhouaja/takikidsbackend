import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Publication from "../models/publication.js";
import Comment from "../models/Comment.js";
import checkPermissions from "../utils/checkPermissions.js";
import Ban from "../models/Ban.js";

const createComment = async (req, res) => {
  const { content } = req.body;
  const { id: publicationId } = req.params;

  if (!content) {
    throw new BadRequestError("Please provide content");
  }

  const publication = await Publication.findById(publicationId);

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  if (!publication.status !== "accepted") {
    throw new NotFoundError("this publication is not open for comments");
  }

  const comment = new Comment({ content, publication: publicationId, user: req.user.userId });

  publication.comments.push(comment);

  await Promise.all([publication.save(), comment.save()]);
  res.status(StatusCodes.CREATED).json({ msg: "comment created", comment });
};

const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new BadRequestError("Please provide content");
  }
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new NotFoundError(`No comment with id :${commentId}`);
  }

  // check permissions
  if (req.user.role === "user") {
    checkPermissions(req.user, comment.user);
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { content },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ msg: "comment updated", updatedComment });
};

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new NotFoundError(`No comment with id :${commentId}`);
  }

  checkPermissions(req.user, comment.user);

  await comment.remove();

  res.status(StatusCodes.OK).json({ msg: "comment removed" });
};

const getAllBans = async (req, res) => {
  const allBans = await Ban.find({ comment: { $exists: true } });

  res.status(StatusCodes.OK).json({ commentsBans: allBans });
};

const banComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new NotFoundError(`No comment with id :${commentId}`);
  }

  if (comment.isBanned) {
    throw new BadRequestError("this comment is already banned");
  }

  const ban = new Ban({ comment: commentId, user: req.user.userId });

  comment.bans.push(ban);

  await Promise.all([comment.save(), ban.save()]);

  res.status(StatusCodes.OK).json({ msg: "your ban is stored", ban });
};

const updateBanComment = async (req, res) => {
  const { id: banId } = req.params;

  const ban = await Ban.findById(banId);

  if (!ban) {
    throw new NotFoundError(`No ban with id :${ban}`);
  }

  await Ban.findOneAndUpdate({ _id: banId }, { status: "accepted" });

  const totalBans = await Ban.find({
    $and: [{ comment: ban.comment }, { status: "accepted" }],
  }).count();

  if (totalBans >= 3) {
    await Comment.findByIdAndUpdate(ban.comment, { status: "banned" });
  }
  console.log(totalBans, ban.comment);

  res.status(StatusCodes.OK).json({ msg: "ban updated to accept status" });
};

export { createComment, updateComment, deleteComment, getAllBans, banComment, updateBanComment };
