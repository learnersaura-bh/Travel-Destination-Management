const initialiseDatabase = require("./db/db");
const express = require("express");
const app = express();
const User = require("./models/user.model");
const destinationRouter = require("./routes/destination.route");

initialiseDatabase();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Trip Advisor Backend");
});

app.use("/destinations", destinationRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


