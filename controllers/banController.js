import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Publication from "../models/publication.js";
import Ban from "../models/Ban.js";

const getAllBans = async (req, res) => {
  const { type, status } = req.query;
  let queryObject = {};
  if (type) {
    queryObject[type] = { $exists: true };
  }

  if (status) {
    queryObject[status] = status;
  }

  const allBans = await Ban.find(queryObject);

  res.status(StatusCodes.OK).json({ allBans });
};

const banPublication = async (req, res) => {
  const { id: publicationId } = req.params;

  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  if (publication.isBanned) {
    throw new BadRequestError("this publication is already banned");
  }

  const ban = new Ban({ publication: publicationId, user: req.user.userId });

  publication.bans.push(ban);

  await Promise.all([publication.save(), ban.save()]);

  res.status(StatusCodes.OK).json({ msg: "your ban is stored" });
};

const deleteBan = async (req, res) => {
  const { id: banId } = req.params;

  const ban = await Ban.findById(banId);

  if (!ban) {
    throw new NotFoundError(`No ban with id :${banId}`);
  }

  await ban.remove();

  res.status(StatusCodes.OK).json({ msg: "ban removed" });
};

const updateBanPublication = async (req, res) => {
  const { id: banId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new BadRequestError("Please provide a status");
  }

  const ban = await Ban.findById(banId);

  if (!ban) {
    throw new NotFoundError(`No ban with id :${ban}`);
  }

  const updatedBan = await Ban.findOneAndUpdate(
    { _id: banId },
    {
      status,
      $push: {
        history: {
          status: ban.status,
          updatedAt: ban.updatedAt,
          adminId: ban.adminId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (status === "accepted") {
    const totalBans = await Ban.find({
      $and: [{ publication: ban.publication }, { status: "accepted" }],
    }).count();

    if (totalBans >= 3) {
      await Publication.findByIdAndUpdate(ban.publication, { status: "banned" });
    }
  }

  res.status(StatusCodes.OK).json({ msg: `ban updated to ${status} status`, updatedBan });
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

export {
  getAllBans,
  banPublication,
  updateBanPublication,
  banComment,
  updateBanComment,
  deleteBan,
};
