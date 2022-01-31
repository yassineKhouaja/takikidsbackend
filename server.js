import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import "express-async-errors";

// db and authenticate user
import connectDB from "./db/connect.js";
// routers

// middleware

console.clear();
dotenv.config();
const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

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
