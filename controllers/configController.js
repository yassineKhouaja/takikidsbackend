import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Config from "../models/Config.js";

const getConfig = async (req, res) => {
  const { id: styleId } = req.params;

  const ConfigData = await Config.findOne({ styleId });
  const config = ConfigData?.data && JSON.parse(ConfigData?.data);

  res.status(StatusCodes.OK).json({ config });
};

const addConfig = async (req, res) => {
  const { styleId, data } = req.body;
  if (!styleId || !data) {
    throw new BadRequestError("Please provide all values");
  }

  const config = new Config({ styleId, data: JSON.stringify(data) });
  await config.save();

  res.status(StatusCodes.CREATED).json({ config });
};

export { getConfig, addConfig };
