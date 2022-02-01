import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import Publication from "../models/publication.js";
import User from "../models/User.js";
import Ban from "../models/Ban.js";
const createPublication = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new BadRequestError("Please provide all values");
  }

  const publication = new Publication({ title, description, user: req.user.userId });
  const user = await User.findById(req.user.userId);

  user.publications.push(publication);

  await Promise.all([publication.save(), user.save()]);
  res.status(StatusCodes.CREATED).json({ publication });
};

const getAllPublications = async (req, res) => {
  const { createdBy, status, sort, search } = req.query;

  const queryObject = { isBanned: false };

  if (createdBy) {
    queryObject.user = createdBy;
  }

  if (req.user.role === "admin" && status) {
    queryObject.status = status;
  } else {
    queryObject.status = "pending";
  }

  if (search) {
    queryObject.title = { $regex: search, $options: "i" };
  }

  let result = Publication.find(queryObject).select("title description");

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("title");
  }
  if (sort === "z-a") {
    result = result.sort("-title");
  }

  const publications = await result
    .populate({
      path: "comments",
      model: "Comment",

      select: "content user",
      populate: {
        path: "user",
        model: "User",
        select: "userName email",
      },
    })
    .populate({
      path: "user",
      model: "User",
      select: "userName email",
    });

  res.status(StatusCodes.OK).json({ publications });
};

const updatePublication = async (req, res) => {
  const { id: publicationId } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    throw new BadRequestError("Please provide all values");
  }
  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  // check permissions
  if (req.user.role === "user") {
    checkPermissions(req.user, publication.user);
  }

  const updatedPublication = await Publication.findOneAndUpdate(
    { _id: publicationId },
    { title, description },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedPublication });
};

const acceptPublication = async (req, res) => {
  const { id: publicationId } = req.params;

  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  const updatedPublication = await Publication.findOneAndUpdate(
    { _id: publicationId },
    { status: "accepted" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedPublication });
};

const deletePublication = async (req, res) => {
  const { id: publicationId } = req.params;

  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  checkPermissions(req.user, publication.user);

  await publication.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! publication removed" });
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

  // if (req.user.userId in publication.bannedBy) {
  //   throw new BadRequestError("you have already banned this publication");
  // }

  const ban = new Ban({ publication: publicationId, user: req.user.userId });

  publication.bans.push(ban);

  await Promise.all([publication.save(), ban.save()]);

  res.status(StatusCodes.OK).json({ msg: "your ban is stored" });
};

const updateBanPublication = async (req, res) => {
  const { id: banId } = req.params;

  const ban = await Ban.findById(banId);

  if (!ban) {
    throw new NotFoundError(`No ban with id :${ban}`);
  }

  await Ban.findOneAndUpdate({ _id: banId }, { status: "accepted" });

  const totalBans = await Ban.find({
    $and: [{ publication: ban.publication }, { status: "accepted" }],
  }).count();

  if (totalBans >= 3) {
    await Publication.findByIdAndUpdate(ban.publication, { status: "banned" });
  }

  res.status(StatusCodes.OK).json({ msg: "ban updated to accept status" });
};

export {
  createPublication,
  updatePublication,
  getAllPublications,
  acceptPublication,
  deletePublication,
  banPublication,
  updateBanPublication,
};
