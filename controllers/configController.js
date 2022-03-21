import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Config from "../models/Config.js";

const getAllConfigs = async (req, res) => {
  const allConfig = await Config.find();
  const allConfigJSON = allConfig.map((config) => ({
    code: config.code,
    label: config.label,
    description: config.description,

    data: JSON.parse(config.data),
  }));

  res.status(StatusCodes.OK).json({ allConfig: allConfigJSON });
};

const addConfig = async (req, res) => {
  const { code, label, description, data } = req.body;

  if (!code || !label || !description || !data) {
    throw new BadRequestError("Please provide all values");
  }

  const config = new Config({ code, label, description, data: JSON.stringify(data) });
  await config.save();

  res.status(StatusCodes.CREATED).json({ config });
};

export { getAllConfigs, addConfig };
