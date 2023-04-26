import express from "express";
const router = express.Router();
import * as depositController from "../controllers/transaction-controller.js";

router.get("/", depositController.transactions);

router.post("/deposit", depositController.deposit);

router.post("/withdrawal", depositController.withdrawal);

router.post("/transfer", depositController.transfer);

export { router as TransactionRouter };
