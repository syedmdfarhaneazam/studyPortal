const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/azamsDB",
    );
    console.log("mongoDB connected");
  } catch (error) {
    console.error("mongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
