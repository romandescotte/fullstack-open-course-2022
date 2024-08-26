const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')


beforeEach(async() => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  await User.deleteMany({})
  
  let userObject = new User(await helper.initialUsers[0]) 
  await userObject.save()

  userObject = new User(await helper.initialUsers[1])
  await userObject.save()  
})

test('blogs are returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
})

test('id is the unique identifier property of the blogs', async() => {
  const blogs = await helper.blogsInDB()
      
  blogs.forEach( (blog, i) => {    
    assert.strictEqual(blog.id, helper.initialBlogs[i]._id)
    assert.strictEqual(blog._id, undefined )
  })
})

test('a new valid blog can be added to api/blogs', async() => {

  const createdUser = await User.find({username: 'root'})
   
  const newBlog = {
    author: 'asde',
    title: 'asd',
    url: 'www.asd.com',
    likes: 0,
    userId: `${createdUser[0]._id.toString()}`
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const lastAddedBlog = blogsAtEnd[blogsAtEnd.length - 1]

  assert(Object.values(lastAddedBlog).includes(newBlog.author ))
  assert(Object.values(lastAddedBlog).includes(newBlog.title))
  assert(Object.values(lastAddedBlog).includes(newBlog.url))
  assert(Object.values(lastAddedBlog).includes(newBlog.likes))
})

test('if likes value is not present it will default to 0', async() => {

  const createdUser = await User.find({username: 'root'})

  const newBlog = {
    author: 'asd',
    title: 'asd',
    url: 'www.asd.com',   
    userId: `${createdUser[0]._id.toString()}`
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()
    

  assert.strictEqual(blogsAtEnd[2].likes, 0)  
})

test('if title or uri are missing backend responds with 400 Bad Request', async() => {

  const createdUser = await User.find({username: 'root'})

  const blogNoTitle = {
    author: 'asd',
    url: 'www.asd.com',
    userId: `${createdUser[0]._id.toString()}`
  }
  const blogNoURL = {
    author: 'asd',
    title: 'asd',
    userId: `${createdUser[0]._id.toString()}`
  }

  await api
    .post('/api/blogs')
    .send(blogNoTitle)
    .expect(400)  

  await api
    .post('/api/blogs')
    .send(blogNoURL)
    .expect(400)
})

test('delete single post deletes that post', async() => {
  const blogs = await helper.blogsInDB()

  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogs2 = await helper.blogsInDB()

  assert.notDeepStrictEqual(blogs2[0].id, blogToDelete.id)  
  assert.strictEqual(blogs.length - 1, blogs2.length )
  
})

test('update likes succeeds with a valid id', async() => {

  const updateLikes = {
    likes: 20
  }
  const blogsAtBeggining = await helper.blogsInDB() 
  
  const blogToUpdate = blogsAtBeggining[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateLikes)
    .expect(201)
  
  const blogsAtEnd = await helper.blogsInDB()

  assert.strictEqual(blogsAtEnd[0].likes, updateLikes.likes)
} )

after(async () => {
  await mongoose.connection.close()
})