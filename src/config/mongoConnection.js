import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

const mongoConnect = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error on MongoDB Connection:", error.message);
    process.exit(1);
  }
};

export default mongoConnect;
