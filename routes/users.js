import express from "express";
import * as UsersController from "../controllers/users-controller.js";
const router = express.Router();

router.get("/", UsersController.getUser);

router.get("/balance", UsersController.getBalance);

export { router as UsersRouter };
