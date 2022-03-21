import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (res, req) => {
  req.status(StatusCodes.NOT_FOUND).send("route does not exist");
};

export default notFoundMiddleware;
