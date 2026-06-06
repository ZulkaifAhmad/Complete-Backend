const mongoose = require("mongoose");

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log("Database Connection Failed:", error);
  }
}

module.exports = dbConnection;

