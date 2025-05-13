export const catchAsyncErr = (theFunction) => {
  return (req, res, next) => {
    // Ensure that the function is wrapped in a promise so it handles async functions correctly
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
