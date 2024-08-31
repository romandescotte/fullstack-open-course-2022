const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {   
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: undefined
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: undefined
  }
]

const initialUsers = async() =>  {
  const users =  [
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

module.exports = {
  initialBlogs, 
  initialUsers,
  blogsInDB,
  usersInDB
}