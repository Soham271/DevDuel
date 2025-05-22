import { user } from "../model/userModel.js";
import { catchAsyncErr } from "../middleware/catchasyncErr.js";
import { ErrorHandler } from "../middleware/err.js";

import crypto from "crypto";
import { generateToken } from "../utlis.js/jwttoken.js";
import { sendEmail } from "../utlis.js/sendmail.js";

// REGISTER CONTROLLER (with file validation)
export const register = catchAsyncErr(async (req, res, next) => {
  if (!req.files || !req.files.avatar || !req.files.resume) {
    return next(new ErrorHandler("Avatar and resume are required!", 400));
  }

  const { fullName, email, password, phone } = req.body;

  const newUser = await user.create({
    fullName,
    email,
    password,
    phone,
  });

  generateToken(newUser, "User Registered", 201, res);
});

// SIGNUP CONTROLLER
export const signup = catchAsyncErr(async (req, res, next) => {
  const { fullName, email, password, confirmationpassword, phone } = req.body;

  if (!fullName || !email || !password || !confirmationpassword || !phone) {
    return next(
      new ErrorHandler(
        "Please provide Full Name, Email, Password, Confirm Password and Phone Number.",
        400
      )
    );
  }

  if (password !== confirmationpassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match.", 400)
    );
  }

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email.",
    });
  }

  const newUser = await user.create({
    fullName,
    email,
    password,
    phone,
  });

  generateToken(newUser, "User Registered Successfully", 201, res);
});

// LOGIN CONTROLLER
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

  const isPasswordMatch = await User.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is incorrect.", 404));
  }

  generateToken(User, "Login successful", 200, res);
});

// LOGOUT CONTROLLER
export const logout = catchAsyncErr(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "User successfully logged out",
    });
});

// GET ALL USERS (ADMIN OR TEST)
export const getuser = catchAsyncErr(async (req, res, next) => {
  const users = await user.find();
  if (!users || users.length === 0) {
    return next(new ErrorHandler("No users found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
});

// UPDATE PASSWORD
export const updatePassword = catchAsyncErr(async (req, res, next) => {
  const { currentpassword, newpassword, confirmationpassword } = req.body;

  if (!currentpassword || !newpassword || !confirmationpassword) {
    return next(new ErrorHandler("All password fields are required", 400));
  }

  const User = await user.findById(req.user.id).select("+password");

  const isPasswordMatch = await User.comparePassword(currentpassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Current password is incorrect", 404));
  }

  if (newpassword !== confirmationpassword) {
    return next(
      new ErrorHandler("New Password and Confirm Password do not match", 404)
    );
  }

  User.password = newpassword;
  await User.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// FORGOT PASSWORD
export const forgetPassword = catchAsyncErr(async (req, res, next) => {
  const User = await user.findOne({ email: req.body.email });

  if (!User) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = User.getResetPasswordToken();
  await User.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore it.`;

  try {
    await sendEmail({
      email: User.email,
      subject: "Password Recovery",
      message,
    });
    res
      .status(200)
      .json({ success: true, message: `Reset link sent to ${User.email}` });
  } catch (error) {
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    await User.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler("Failed to send email. Try again later.", 500)
    );
  }
});

// RESET PASSWORD
export const resetPassword = catchAsyncErr(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const User = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!User) {
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  User.password = req.body.password;
  User.resetPasswordToken = undefined;
  User.resetPasswordExpire = undefined;

  await User.save();
  generateToken(User, "Password Reset Successfully", 200, res);
});

// GetMyprofile
export const GetMyprofile = catchAsyncErr(async (req, res, next) => {
  const User = await user.findById(req.user._id);
  if (!User) {
    return next(new ErrorHandler("Code is Inavlid", 400));
  }
  res.status(200).send({
    success: true,
    message: User,
  });
});
export const UpdateProfile = catchAsyncErr(async (req, res, next) => {
  const { fullName, phone } = req.body;

  const User = await user.findById(req.user._id);
  if (!User) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (fullName) User.fullName = fullName;
  if (phone) User.phone = phone;

  await User.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: User,
  });
});
