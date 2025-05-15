import mongoose from "mongoose";

const dbconnect = () => {
  return mongoose
    .connect(process.env.MONGO_URL, {
      // Ensure correct connection string
     
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    });
};

export default dbconnect;
