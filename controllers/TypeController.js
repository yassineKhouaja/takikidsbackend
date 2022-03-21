import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import Type from "../models/Type.js";

const getAllTypes = async (req, res) => {
  const allTypes = await Type.find();

  res.status(StatusCodes.OK).json({ allTypes });
};

const addType = async (req, res) => {
  const { value, option } = req.body;

  if (!value || !option) {
    throw new BadRequestError("Please provide all values");
  }

  const type = new Type({ value, option });
  await type.save();

  res.status(StatusCodes.CREATED).json({ type });
};

export { addType, getAllTypes };
