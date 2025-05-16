// Backend/controllers/ContestController.js
import CreateContestModel from "../model/contestModel.js";
import { catchAsyncErr } from "../middleware/catchasyncErr.js";
import { ErrorHandler } from "../middleware/err.js";

export const CreateContest = catchAsyncErr(async (req, res, next) => {
  const { Title, Level, Duration, Language, Code } = req.body;

  if (!Title || !Level || !Duration || !Language || !Code) {
    return next(
      new ErrorHandler(
        "All fields (Title, Level, Duration, Language, Code) are required",
        400
      )
    );
  }

  try {
    const contest = await CreateContestModel.create({
      Title,
      Level,
      Duration,
      Language,
      Code,
    });

    res.status(201).json({
      success: true,
      message: "Contest created successfully",
      contest,
    });
  } catch (err) {
    return next(new ErrorHandler("Contest creation failed", 500));
  }
});
