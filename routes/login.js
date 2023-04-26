import express from "express";
import * as users from "../controllers/login-controller.js";

const router = express.Router();

router.get("/login", users.login);
router.get("/register", users.register);

export { router as LoginRouter };
