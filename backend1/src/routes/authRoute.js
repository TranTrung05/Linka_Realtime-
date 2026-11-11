import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/signout", signOut);

export default router;
