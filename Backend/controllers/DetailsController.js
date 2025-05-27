// controllers/DetailsController.js
import { catchAsyncErr } from "../middleware/catchasyncErr.js";
import { ErrorHandler } from "../middleware/err.js";
import Details from "../model/DetailsScheme.js";
import jwt from "jsonwebtoken";
import { user } from "../model/userModel.js";

export const CreateDetails = catchAsyncErr(async (req, res, next) => {
  const { Contest_id, Score, TotalScore, Language } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!Contest_id || !Score || !TotalScore || !Language) {
    return next(new ErrorHandler("All details are required", 400));
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error("Token verification failed:", error);
    return next(new ErrorHandler("Invalid token", 401));
  }

  const foundUser = await user.findById(decoded.id);
  if (!foundUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  const details = await Details.create({
    Contest_id,
    Score,
    TotalScore,
    Language,
    user: foundUser._id,
  });

  if (!details) {
    return next(new ErrorHandler("Failed to create details", 500));
  }

  res.status(200).json({
    success: true,
    message: details,
  });
});

export const getDetails = catchAsyncErr(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error("Token verification failed:", error);
    return next(new ErrorHandler("Invalid token", 401));
  }

  const details = await Details.find({ user: decoded.id }).populate(
    "user",
    "name email"
  );
  if (!details || details.length === 0) {
    return next(new ErrorHandler("No details found", 404));
  }

  res.status(200).json({
    success: true,
    message: details,
  });
});