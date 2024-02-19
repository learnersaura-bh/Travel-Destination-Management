const express = require('express')

const {
  readAllUsers
} = require('../controllers/user.controller')

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  try {
    const allUsers = await readAllUsers();
    res.status(201).json({ message: 'Users fetched successfully', users: allUsers })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all users' })
  }
})

module.exports = userRouter;