const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const helper = require('./blogs_api_helper')
const bcrypt = require('bcrypt')
const { usersInDB } = require('./helper')



describe('when there is initially one user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({})
  
    const user = new User({
      username: 'root',
      passwordHash: await bcrypt.hash('1234', 10),
      name: 'R'
    })
    await user.save()
  })
  test('test fails if adding a user whose username already exists', async () => {

    const initialUsers = await usersInDB()

    const existingUser = {
      username: 'root',
      password: await bcrypt.hash('1234', 10),
      name: 'Z'
    }
  
    await api
      .post('/api/users')
      .send(existingUser)
      .expect(400)  

    const finalUsers = await usersInDB()
    console.log(finalUsers)
    assert.strictEqual(initialUsers.length, finalUsers.length)
  })
})

describe('when creating a new user', () => {
  beforeEach(async() => {
    await User.deleteMany({})    
  })

  test('test fails if password is shorter than 3 characters long', async() => {
    const user = {
      username: 'root',
      password: '12',
      name: 'R'
    }
      
   await api
      .post('/api/users')
      .send(user)
      .expect(400)
   
  })

  test('test fails if username is shorter than 3 characters long', async() => {
    const user = {
      username: 'rt',
      password: '1234',
      name: 'R'
    }
        
    await api
      .post('/api/users')
      .send(user)
      .expect(400)      
  })
})

after(async () => {
  mongoose.connection.close()
})
