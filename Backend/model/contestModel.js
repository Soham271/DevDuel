import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
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
    type: Number, // ✅ Store in minutes
    required: true,
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
  isRunning: {
    type: Boolean,
    default: true, // ✅ Used to fetch running contests
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

const CreateContestModel = mongoose.model("createContest", ContestSchema);
export default CreateContestModel;
