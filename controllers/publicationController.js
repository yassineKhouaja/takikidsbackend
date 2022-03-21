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

  user.publications.push(publication);

  await Promise.all([publication.save(), user.save()]);
  res.status(StatusCodes.CREATED).json({ publication });
};

const getAllPublications = async (req, res) => {
  const { sort, search } = req.query;

  const queryObject = { status: "confirmed" };

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

const myPublication = async (req, res) => {
  const { sort, search } = req.query;

  const queryObject = { status: { $ne: "banned" }, user: req.user.userId };

  if (search) {
    queryObject.title = { $regex: search, $options: "i" };
  }

  let result = Publication.find(queryObject);
  // .select("title description");

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
    {
      title,
      description,
      $push: {
        history: {
          title: publication.title,
          description: publication.description,
          status: publication.status,
          updatedAt: publication.updatedAt,
          modifiedBy: req.user.userId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ msg: "publication updated", updatedPublication });
};

const acceptPublication = async (req, res) => {
  const { id: publicationId } = req.params;

  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }

  const updatedPublication = await Publication.findOneAndUpdate(
    { _id: publicationId },
    {
      status: "confirmed",
      $push: {
        history: {
          title: publication.title,
          description: publication.description,
          status: publication.status,
          updatedAt: publication.updatedAt,
          modifiedBy: req.user.userId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ msg: "publication confirmed", updatedPublication });
};

const deletePublication = async (req, res) => {
  const { id: publicationId } = req.params;

  const publication = await Publication.findOne({ _id: publicationId });

  if (!publication) {
    throw new NotFoundError(`No publication with id :${publicationId}`);
  }
  if (req.user.role !== "admin") {
    checkPermissions(req.user, publication.user);
  }

  await publication.remove();

  res.status(StatusCodes.OK).json({ msg: "publication removed" });
};

export {
  createPublication,
  myPublication,
  updatePublication,
  getAllPublications,
  acceptPublication,
  deletePublication,
};
