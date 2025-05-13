import { user } from "../model/userModel.js";
import { catchAsyncErr } from "../middleware/catchasyncErr.js";
import { ErrorHandler } from "../middleware/err.js";

import crypto from "crypto";
import { generateToken } from "../utlis.js/jwttoken.js";
import { sendEmail } from "../utlis.js/sendmail.js";

export const register = catchAsyncErr(async (req, res, next) => {
  if (!req.files || !req.files.avatar || !req.files.resume) {
    return next(new ErrorHandler("Avatar and resume are required!", 400));
  }

  const { fullName, email, password } = req.body;

  const newUser = await user.create({
    fullName,
    email,
    password,
  });

  // Pass the 'res' object here
  generateToken(newUser, "User Registered", 201, res);
});
export const signup = catchAsyncErr(async (req, res, next) => {
  const { email, password, confirmationpassword } = req.body;

  console.log("Request body:", req.body);

  if (!email || !password || !confirmationpassword) {
    return next(
      new ErrorHandler(
        "Please provide Email, Password, and Confirm Password.",
        400
      )
    );
  }

  if (password !== confirmationpassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match.", 400)
    );
  }

  // Check if the user already exists by email
  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email.",
    });
  }

  const newUser = await user.create({
    email,
    password,
  });

  // Generate token for the user after successful registration
  generateToken(newUser, "User Registered Successfully", 201, res);

  res.status(201).json({
    success: true,
    message: "User successfully registered",
    newUser,
  });
});

export const login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide Email and Password.", 400));
  }

  const User = await user.findOne({ email }).select("+password");

  if (!User) {
    return next(
      new ErrorHandler("Either Email or Password is incorrect.", 404)
    );
  }

  const hashedPassword = String(User.password);
  const enteredPassword = String(password);

  const isPasswordMatch = await User.comparePassword(enteredPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is incorrect.", 404));
  }

  generateToken(User, "Login successful", 200, res);
});
export const logout = catchAsyncErr(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      sucess: true,
      message: "user is SucessFully get Logged out",
    });
});

export const getuser = catchAsyncErr(async (req, res, next) => {
  const User = await user.find();
  if (!User) {
    return next(new ErrorHandler("data is Not Found", 404));
  }
  res.status(200).json({
    sucess: true,
    message: "Data is Sucessfully found",
    User,
  });
});
export const updatePassword = catchAsyncErr(async (req, res, next) => {
  const { currentpassword, newpassword, confirmationpassword } = req.body;
  if (!currentpassword || !newpassword || !confirmationpassword) {
    return next(new ErrorHandler("give all the Data", 400));
  }
  const User = await user.findById(req.user.id).select("+password");
  const isPasswordmatch = await User.comparePassword(currentpassword);
  if (!isPasswordmatch) {
    return next(new ErrorHandler("Errror password didn't match", 404));
  }
  if (newpassword !== confirmationpassword) {
    return next(new ErrorHandler("NP and CP doesnt match", 404));
  }
  User.password = newpassword;
  await User.save();
  res.status(200).json({
    sucess: true,
    message: "User Password is change sucessfully",
  });
});
export const forgetPassword = catchAsyncErr(async (req, res, next) => {
  const User = await user.findOne({ email: req.body.email });

  if (!User) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Generate reset token
  const resetToken = User.getResetPasswordToken();
  await User.save({ validateBeforeSave: false });

  // Create reset URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is:- \n\n ${resetPasswordUrl} 
  \n\nIf you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: User.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset link sent to ${User.email} successfully`,
    });
  } catch (error) {
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    await User.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErr(async (req, res, next) => {
  // Hash the token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with valid token
  const User = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // Validate token
  if (!User) {
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  // Validate password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Update password
  User.password = req.body.password;
  User.resetPasswordToken = undefined;
  User.resetPasswordExpire = undefined;

  await User.save();

  // Generate new token and send response
  generateToken(User, "Password Reset Successfully", 200, res);
});
