import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import authJwt from "./helpers/auth-jwt.js";
import errorHandler from "./helpers/error-handler.js";
import "dotenv/config";
const app = express();

// cors
app.use(cors());
app.options("*", cors());

// routes
import { LoginRouter } from "./routes/login.js";
import { UsersRouter } from "./routes/users.js";
import { TransactionRouter } from "./routes/transaction.js";

// middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(authJwt());
app.use(errorHandler);

const api = process.env.API_URL;

app.use(`${api}/`, LoginRouter);
app.use(`${api}/users`, UsersRouter);
app.use(`${api}/transaction`, TransactionRouter);

// Database configuration
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ewallet_database",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(`Database connection failed with error: ${err}`);
  });

// Server configuration
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
