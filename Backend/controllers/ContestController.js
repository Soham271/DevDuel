import CreateContestModel from "../model/contestModel.js";
import { catchAsyncErr } from "../middleware/catchasyncErr.js";
import { ErrorHandler } from "../middleware/err.js";
import problems from "../json-data/problems.js";


const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const CreateContest = catchAsyncErr(async (req, res, next) => {
  const { Title, Level, Duration, Language, Code } = req.body;

 
  if (!Title || !Level || !Duration || !Language || !Code) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const codeNumber = Number(Code);
  if (isNaN(codeNumber)) {
    return next(new ErrorHandler("Invalid contest code", 400));
  }


  const existingContest = await CreateContestModel.findOne({ Code: codeNumber });
  if (existingContest) {
    return next(new ErrorHandler("Contest code already exists", 400));
  }

  const filteredQuestions = problems.filter(
    (q) => q.difficulty.toLowerCase() === Level.toLowerCase()
  );

  if (filteredQuestions.length === 0) {
    return next(new ErrorHandler(`No questions found for level: ${Level}`, 400));
  }

  const selectedQuestion = getRandomElement(filteredQuestions);

 
  const contest = await CreateContestModel.create({
    Title,
    Level,
    Duration,
    Language,
    Code: codeNumber,
    Questions: [selectedQuestion],
  });

  res.status(201).json({
    success: true,
    message: "Contest created successfully",
    contest,
  });
});

export const GetContestDetails = catchAsyncErr(async (req, res, next) => {
  const { code } = req.params;
  const codeNumber = Number(code);

  if (isNaN(codeNumber)) {
    return next(new ErrorHandler("Invalid contest code", 400));
  }

  const contest = await CreateContestModel.findOne({ Code: codeNumber });
  if (!contest) {
    return next(new ErrorHandler("Contest not found", 404));
  }

  res.status(200).json({
    success: true,
    contest,
  });
});
