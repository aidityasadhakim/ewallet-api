import express from "express";
const router = express.Router();
import * as depositController from "../controllers/transaction-controller.js";

router.put("/deposit", depositController.deposit);

router.put("/withdrawal", depositController.withdrawal);

router.put("/transfer", depositController.transfer);

export { router as DepositRouter };
