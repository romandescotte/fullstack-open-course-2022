const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')

describe('when there is initially one or more user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({})  

    const initialUsers = await helper.initialUsers()

    let user = new User(initialUsers[0])
    await user.save()
  

    user = new User(initialUsers[1])
    await user.save()
  })
  
  test('test fails if adding a user whose username already exists', async () => {

    const initialUsers = await helper.usersInDB()

    const existingUser = {
      username: 'root',
      password: '1234',
      name: 'Z'
    }
  
    await api
      .post('/api/users')
      .send(existingUser)
      .expect(400)  

    const finalUsers = await helper.usersInDB()
    console.log(finalUsers)
    assert.strictEqual(initialUsers.length, finalUsers.length)
  })
})

describe('when creating a new user', () => {
 
  test('test fails if password is shorter than 3 characters long', async() => {

    const usersAtBeginning = await helper.usersInDB()

    const user = {
      username: 'root',
      password: '12',
      name: 'R'
    }
      
   await api
      .post('/api/users')
      .send(user)
      .expect(400)  

    const usersAtEnd = await helper.usersInDB()

    assert.strictEqual(usersAtEnd.length, usersAtBeginning.length)
  })

  test('test fails if username is shorter than 3 characters long', async() => {

    const usersAtBeginning = await helper.usersInDB()

    const user = {
      username: 'rt',
      password: '1234',
      name: 'R'
    }
        
    await api
      .post('/api/users')
      .send(user)
      .expect(400)   

    const usersAtEnd = await helper.usersInDB()

    assert.strictEqual(usersAtEnd.length, usersAtBeginning.length)
  })
})

after(async () => {
  mongoose.connection.close()
})
