const User = require("../models/user.model");

const readAllUsers = async () => {
  try {
    const allUsers = await User.find();
    console.log("All users:", allUsers);
    return allUsers;
  } catch (error) {
    console.log("Error getting all users:", error);
  }
};

module.exports = {
  readAllUsers,
};
