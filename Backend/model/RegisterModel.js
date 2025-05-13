import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    FullName: String,
    email: String,
    phone: String,
    github: String,
    linkedin: String,
    domainSpecialization: String,
    skills: String,
    experience: String,
  },
  { timestamps: true }
);

const Register = mongoose.model("Register", registerSchema);
export default Register;
