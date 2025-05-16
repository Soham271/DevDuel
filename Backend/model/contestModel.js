// Backend/model/contestModel.js
import mongoose from "mongoose";

const Contestschema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Level: {
    type: String,
    required: true,
  },
  Duration: {
    type: String,
    required: true,
  },
  Language: {
    type: String,
    required: true,
  },
  Code: {
    type: Number,
    required: true,
    unique: true,
  },
});

const CreateContestModel = mongoose.model("createContest", Contestschema);
export default CreateContestModel;
