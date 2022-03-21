import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import "express-async-errors";
import cors from "cors";
// db and authenticate user
import connectDB from "./db/connect.js";
// routers
import authRouter from "./routes/authRoutes.js";
import publicationRouter from "./routes/publicationsRoutes.js";
import commentRouter from "./routes/commentsRoutes.js";
import banRouter from "./routes/bansRoutes.js";
import configRouter from "./routes/configRoutes.js";
import typeRouter from "./routes/typeRoutes.js";

// middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
// documentations
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

console.clear();
dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());

app.use("/api/v1/config", configRouter);
app.use("/api/v1/type", typeRouter);

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/publications", publicationRouter);
// app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/bans", banRouter);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log("server is listenning on port ", port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
