import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is Required"],
  },
  password: {
    type: String,
    required: [true, "pass is required"],
    minLength: [8, "max is 16"],
    select: false,
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Please enter your phone number"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password by hashing
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token generation
userSchema.methods.generateJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY || "default_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "5d",
    }
  );
  return token;
};

// Generate and hash reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256") // Correct hashing function (sha256)
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const user = mongoose.model("User", userSchema);
