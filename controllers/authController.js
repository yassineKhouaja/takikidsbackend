import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import User from "../models/User.js";

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ userName, email, password });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    msg: "user created",
    user: {
      email: user.email,
      userName: user.userName,
    },
    token,
  });
};

const newUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ userName, email, password });

  res.status(StatusCodes.CREATED).json({
    msg: "user created",
    user: {
      email: user.email,
      userName: user.userName,
      password,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("invalid credentials");
  }
  const token = user.createJWT();

  user.password = undefined;

  res.status(StatusCodes.OK).json({
    msg: "successful login",
    user,
    token,
  });
};

const updateUser = async (req, res) => {
  const { email, userName } = req.body;

  if (!email || !userName) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.userName = userName;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    msg: "account updated",
    user,
    token,
  });
};

const allUsers = async (req, res) => {
  const { role } = req.query;
  const queryObject = {};

  if (role) {
    queryObject.role = role;
  }
  const users = await User.find(queryObject);

  res.status(StatusCodes.OK).json({
    users,
  });
};

const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, userName, role } = req.body;

  if (!email || !userName || !role) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new BadRequestError("Please provide a valid user id");
  }

  if (user?.role === "admin") {
    throw new UnauthenticatedError("you can't update admin account");
  }
  user.email = email;
  user.userName = userName;
  user.role = role;

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "user updated",
    user,
  });
};

const deleteUserAdmin = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new BadRequestError("Please provide a valid user id");
  }

  if (user.role === "admin") {
    throw new UnauthenticatedError("you can't delete admin account");
  }

  await user.remove();

  res.status(StatusCodes.OK).json({
    msg: "user deleted",
  });
};

export { register, newUser, login, updateUser, deleteUserAdmin, updateUserAdmin, allUsers };
