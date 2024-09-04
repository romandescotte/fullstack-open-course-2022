const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: undefined
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: undefined
  }
]

const initialUsers = async() =>  {
  const users = [
    {
      username: 'root',
      passwordHash: await bcrypt.hash('1234', 10),
      name: 'Romancio'
    },
    {
      username: 'admin',
      passwordHash: await bcrypt.hash('2345', 10),
      name: 'Romancete'
    }
  ]
  return users
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUsers = async () => {
  const users = await initialUsers()
  let user = new User(users[0])
  await user.save()
  user = new User(users[1])
  await user.save()
}

const logValidUser = async() => {
  const userForTesting = {
    username: 'root',
    password: '1234'
  }
  const { body } = await api
    .post('/login')
    .send(userForTesting)

  return body
}

const logInvalidUser = async() => {
  const userForTesting = {
    username: 'root',
    password: '1235'
  }
  const { body } = await api
    .post('/login')
    .send(userForTesting)
  return body
}

const createBlog = async() => {
  await createUsers()
  const user = await logValidUser()

  const newBlog = {
    author: 'test maniac',
    title: 'blog for testing',
    url: 'www.testtesttest.com',
    likes: 7357
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${user.token}` })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersInDB,
  createUsers,
  logValidUser,
  logInvalidUser,
  createBlog
}