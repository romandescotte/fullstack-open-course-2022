const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

usersRouter.get('/', async(req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async(req, res, next) => {

  try {
    const { username, password, name } = req.body

    if(password.length < 3) {    
      return res.status(400).json({ error: 'password must be minimum 3 characters long' }).end()
    }
    if(username.length < 3) {
      return res.status(400).json({ error: 'username must be minimum 3 characters long' })
    }
   
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User ({
      username,
      passwordHash,
      name
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)     

  } catch(error) {      
    next(error)
  }
})

module.exports = usersRouter

