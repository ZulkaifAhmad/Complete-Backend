const mongoose = require("mongoose");

async function dbConnection() {
  try {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));

    console.log("Database Connected Successfully !");
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnection;
