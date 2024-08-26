const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const logger = require('../utils/logger')
const config = require('../utils/config')

loginRouter.post('/', async(req, res) => {

  const { username, password } = req.body

  const user = await User.findOne({username}) 
  console.log(user)
  const passwordCorrect = user === null 
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if(!(user && passwordCorrect)) {
    return res.status(401).json({error: 'username or password are invalid'})
  } 

  const userForToken = {
    user: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, config.SECRET)

  try {
    res
      .status(200)
      .send({token, username: user.username, name: user.name})
  }
  catch (error) {
    next(error)
  }


})


module.exports = loginRouter