const mongoose = require("mongoose");

const mySecret = process.env["MONGODB_URI"];

async function initialiseDatabase() {
  try {
    await mongoose.connect(mySecret);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = initialiseDatabase;
