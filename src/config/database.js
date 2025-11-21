const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err);
    throw err;
  }
};

module.exports = connectDB;
