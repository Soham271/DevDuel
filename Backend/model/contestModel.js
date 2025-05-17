import mongoose from "mongoose";

const Contestschema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Level: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  Duration: {
    type: String,
    required: true,
    enum: ["1min","5min", "10min", "20min", "30min", "40min", "50min", "1hr"],
  },
  Language: {
    type: String,
    required: true,
    enum: ["C", "C++", "Java", "Python"],
  },
  Code: {
    type: Number,
    required: true,
    unique: true,
  },
  Questions: [
    {
      id: String,
      title: String,
      description: String,
      difficulty: String,
      inputFormat: String,
      outputFormat: String,
      sampleInput: String,
      sampleOutput: String,
      testCases: [
        {
          input: String,
          output: String,
        },
      ],
    },
  ],
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CreateContestModel = mongoose.model("createContest", Contestschema);
export default CreateContestModel;
