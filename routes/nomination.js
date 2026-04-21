import express from "express";
import {
  submitNomination,
  verifyEmailController,
} from "../controllers/nominationController.js";

const router = express.Router();

router.post("/submit", submitNomination);
router.get("/verify", verifyEmailController);

export default router;