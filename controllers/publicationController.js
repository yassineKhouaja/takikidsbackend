import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import Publication from "../models/publication.js";
import User from "../models/User.js";
const createPublication = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new BadRequestError("Please provide all values");
  }

  const publication = new Publication({ title, description, user: req.user.userId });
  const user = await User.findById(req.user.userId);
  console.log(req.user.userId);
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
        select: "userName",
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

  if (req.user.userId in publication.bannedBy) {
    throw new BadRequestError("you have already banned this publication");
  }

  publication.bannedBy.push(req.user.userId);

  if (publication.bannedBy.length === 3) {
    publication.isBanned = true;
  }

  await publication.save();

  res.status(StatusCodes.OK).json({ msg: "your ban is stored" });
};

export {
  createPublication,
  updatePublication,
  getAllPublications,
  deletePublication,
  banPublication,
};
