const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./blogs_api_helper')



beforeEach(async() => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
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
    assert.strictEqual(blog.id, helper.initialBlogs[i]._id)
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

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

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

test.only('if title or uri are missing backend responds with 400 Bad Request', async() => {
  const blogNoTitle = {
    author: 'asd',
    url: 'www.asd.com'
  }
  const blogNoURL = {
    author: 'asd',
    title: 'asd'
  }
  const blogs = await api
    .post('/api/blogs')
    .send(blogNoTitle)
    .expect(400)  


  const blogs2 = await api
    .post('/api/blogs')
    .send(blogNoURL)
    .expect(400)
})

test.only('delete single post deletes that post', async() => {
  const {body: blogs} = await api
    .get('/api/blogs')

  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
})

test.only('update likes succeeds with a valid id', async() => {

  const updateLikes = {
    likes: 20
  }
  const {body: blogs} = await api
    .get('/api/blogs')
  
  const blogToUpdate = blogs[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateLikes)
    .expect(201)
  
  const {body: blogsAtEnd} = await api
    .get('/api/blogs')

  assert.strictEqual(blogsAtEnd[0].likes, updateLikes.likes)
} )

after(async () => {
  await mongoose.connection.close()
})