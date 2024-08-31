const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')
const fs = require('fs')

beforeEach(async() => {

  await User.deleteMany({})
  //sacar esto a un helper luego y usar loop
  const initialUsers = await helper.initialUsers()
  let user = new User(initialUsers[0])
  await user.save()
  user = new User(initialUsers[1])
  await user.save() 

  
  
  await Blog.deleteMany({})
  // let blogObject = new Blog(helper.initialBlogs[0])
  // await blogObject.save()
  // blogObject = new Blog(helper.initialBlogs[1])
  // await blogObject.save()


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
    assert(blog.id)
    assert.strictEqual(blog._id, undefined )
  })
})

test('a new valid blog can be added to api/blogs', async() => {
  const userForTesting = {
    username: 'root',
    password: '1234'
  }
  const { body } = await api
    .post('/login')
    .send(userForTesting)
    .expect(200)
  
  const newBlog = {
    author: 'Blog para tests',
    title: 'Blog para tests',
    url: 'www.asd.com',
    likes: 0
  }

  console.log('body', body)
  const blogSent = await api
    .post('/api/blogs')   
    .set({Authorization: `Bearer ${body.token}`})
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()
  console.log('blogsatEnd', blogsAtEnd)
  assert.strictEqual(blogsAtEnd.length, 1)

  const lastAddedBlog = blogsAtEnd[blogsAtEnd.length - 1]

  console.log('last added blog', lastAddedBlog)

  assert(Object.values(lastAddedBlog).includes(newBlog.author ))

  // assert(Object.values(lastAddedBlog).includes(newBlog.title))
  // assert(Object.values(lastAddedBlog).includes(newBlog.url))
  // assert(Object.values(lastAddedBlog).includes(newBlog.likes))
})

test.only('can login', async() => {
  const userForTesting = {
    username: 'root',
    password: '1234'
  }
  const llamada = await api
    .post('/login')
    .send(userForTesting)
    .expect(200)
  
  fs.writeFile("test-output.txt", JSON.stringify(llamada.body), err => {
    if (err) throw err;
    console.log('test-output.txt successfully written to disk');
  })  
  console.log()

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