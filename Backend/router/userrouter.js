import express from "express";
import {
  getuser,
  login,
  register,
  logout,
  updatePassword,
  forgetPassword,
  resetPassword,
  signup,
} from "../controllers/UserController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getuser);
router.put("/update/password", isAuthenticated, updatePassword);
router.post("/password/forget", forgetPassword);
router.put("/reset/password/:token", resetPassword);
router.post("/signup", signup);
export default router;
