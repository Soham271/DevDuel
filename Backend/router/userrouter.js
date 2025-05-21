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
  GetMyprofile,
  UpdateProfile,
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
router.put("/edit-Profile", isAuthenticated, UpdateProfile);
router.post("/signup", signup);
router.get("/myprofile", isAuthenticated, GetMyprofile);
export default router;
