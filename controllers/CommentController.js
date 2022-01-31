import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Publication from "../models/publication.js";
import Comment from "../models/Comment.js";

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

export { createComment };

// const getAllPublications = async (req, res) => {
//   const { createdBy, status, sort, search } = req.query;

//   const queryObject = {};

//   if (createdBy) {
//     queryObject.user = createdBy;
//   }

//   if (req.user.role === "admin" && status) {
//     queryObject.status = status;
//   } else {
//     queryObject.status = "accepted";
//   }

//   if (search) {
//     queryObject.title = { $regex: search, $options: "i" };
//   }

//   let result = Publication.find(queryObject);

//   if (sort === "latest") {
//     result = result.sort("-createdAt");
//   }
//   if (sort === "oldest") {
//     result = result.sort("createdAt");
//   }
//   if (sort === "a-z") {
//     result = result.sort("title");
//   }
//   if (sort === "z-a") {
//     result = result.sort("-title");
//   }

//   const publications = await result;

//   res.status(StatusCodes.OK).json({ publications });
// };

// const updatePublication = async (req, res) => {
//   const { id: publicationId } = req.params;
//   const { title, description } = req.body;

//   if (!title || !description) {
//     throw new BadRequestError("Please provide all values");
//   }
//   const publication = await Publication.findOne({ _id: publicationId });

//   if (!publication) {
//     throw new NotFoundError(`No publication with id :${publicationId}`);
//   }

//   // check permissions
//   if (req.user.role === "user") {
//     checkPermissions(req.user, publication.user);
//   }

//   const updatedPublication = await Publication.findOneAndUpdate(
//     { _id: publicationId },
//     { title, description },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(StatusCodes.OK).json({ updatedPublication });
// };

// const deletePublication = async (req, res) => {
//   const { id: publicationId } = req.params;

//   const publication = await Publication.findOne({ _id: publicationId });

//   if (!publication) {
//     throw new NotFoundError(`No publication with id :${publicationId}`);
//   }

//   checkPermissions(req.user, publication.user);

//   await publication.remove();

//   res.status(StatusCodes.OK).json({ msg: "Success! publication removed" });
// };
