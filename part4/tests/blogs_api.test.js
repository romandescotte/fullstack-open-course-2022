const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]

beforeEach(async() => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test.only('notes are returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
})

test.only('id is the unique identifier property of the blogs', async() => {
  const { body:blogs } = await api 
    .get('/api/blogs')   
    
  blogs.forEach( (blog, i) => {    
    assert.strictEqual(blog.id, initialBlogs[i]._id)
    assert.strictEqual(blog._id, undefined )
  })
})

test.only('a new valid blog can be added to api/blogs', async() => {
  
  const newBlog = {
    author: 'asde',
    title: 'asd',
    url: 'www.asd.com',
    likes: 0
  }
  
  const blogs = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')  

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const lastAddedBlog = response.body[response.body.length - 1]

  assert(Object.values(lastAddedBlog).includes(newBlog.author ))
  assert(Object.values(lastAddedBlog).includes(newBlog.title))
  assert(Object.values(lastAddedBlog).includes(newBlog.url))
  assert(Object.values(lastAddedBlog).includes(newBlog.likes))
})

test.only('if likes value is not present it will default to 0', async() => {
  const newBlog = {
    author: 'asd',
    title: 'asd',
    url: 'www.asd.com',    
  }

  const blogs = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  assert.strictEqual(response.body[2].likes, 0)  
})


after(async () => {
  await mongoose.connection.close()
})