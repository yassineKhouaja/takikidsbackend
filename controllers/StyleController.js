import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import Style from "../models/Style.js";

const getStyles = async (req, res) => {
  const { id: typeId } = req.params;

  const styles = await Style.find({ typeId });

  res.status(StatusCodes.OK).json({ styles });
};

const addStyle = async (req, res) => {
  const { value, option, typeId } = req.body;

  if (!value || !option || !typeId) {
    throw new BadRequestError("Please provide all values");
  }

  const style = new Style({ value, option, typeId });
  await style.save();

  res.status(StatusCodes.CREATED).json({ style });
};

export { getStyles, addStyle };
