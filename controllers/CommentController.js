import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Publication from "../models/publication.js";
import Comment from "../models/Comment.js";
import checkPermissions from "../utils/checkPermissions.js";

const createComment = async (req, res) => {
  const { content } = req.body;
  const { id: publicationId } = req.params;

  if (!content) {
    throw new BadRequestError("Please provide content");
  }

  const comment = new Comment({ content, publication: publicationId, user: req.user.userId });
  const publication = await Publication.findById(publicationId);

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  publication.comments.push(comment);

  await Promise.all([publication.save(), comment.save()]);
  res.status(StatusCodes.CREATED).json({ comment });
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

  res.status(StatusCodes.OK).json({ updatedComment });
};

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new NotFoundError(`No comment with id :${commentId}`);
  }

  checkPermissions(req.user, comment.user);

  await comment.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! comment removed" });
};

export { createComment, updateComment, deleteComment };