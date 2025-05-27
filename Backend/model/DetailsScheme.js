// model/DetailsSchema.js
import mongoose from "mongoose";

const DetailsSchema = new mongoose.Schema({
  Contest_id: { type: Number, required: true }, // Corrected spelling
  Score: { type: Number, required: true },
  TotalScore: { type: Number, required: true },
  Language: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  submittedAt: { type: Date, default: Date.now },
});

const Details = mongoose.model("Details", DetailsSchema);
export default Details;