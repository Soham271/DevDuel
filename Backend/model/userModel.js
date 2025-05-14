import mongoose from "mongoose";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { type } from "os";

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
    minLength: [8, "  max is 16"],
    select: false,
  },
  
  },
});
// Hash Pass before Save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// compare password by hashing
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

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256") // Fix the typo: 'shad256' → 'sha256'
    .update(resetToken)
    .digest("hex");

  // Set expiration time for the reset token
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

export const user = mongoose.model("User", userSchema);
