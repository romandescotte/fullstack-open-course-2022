const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')

//sacar helpers, usar loop,
//remover try catch y usar ese plugin de errores https://fullstackopen.com/en/part4/testing_the_backend#eliminating-the-try-catch
describe('when there are some blogs in the db', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})  
    await User.deleteMany({})
    //sacar esto a un helper luego y usar loop
    const initialUsers = await helper.initialUsers()
    let user = new User(initialUsers[0])
    await user.save()
    user = new User(initialUsers[1])
    await user.save()

    const userForTesting = {
      username: 'root',
      password: '1234'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)
    
    const newBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: 'www.testtesttest.com',
      likes: 7357
    }
  
    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
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
})

describe('creation of a new blog', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})  
    await User.deleteMany({})
    //sacar esto a un helper luego y usar loop
    const initialUsers = await helper.initialUsers()
    let user = new User(initialUsers[0])
    await user.save()
    user = new User(initialUsers[1])
    await user.save()
  })

  test('succeeds when the user is valid', async() => {
    const userForTesting = {
      username: 'root',
      password: '1234'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)
    
    const newBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: 'www.testtesttest.com',
      likes: 7357
    }  
  
    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDB()
   
    assert.strictEqual(blogsAtEnd.length, 1)
  
    const lastAddedBlog = blogsAtEnd[blogsAtEnd.length - 1]
  
    assert(Object.values(lastAddedBlog).includes(newBlog.author ))  
    assert(Object.values(lastAddedBlog).includes(newBlog.title))
    assert(Object.values(lastAddedBlog).includes(newBlog.url))
    assert(Object.values(lastAddedBlog).includes(newBlog.likes))
  })
  
  test('doesn´t succeed whe the user is invalid', async() => {
    const userForTesting = {
      username: 'root',
      password: '1235'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(401)
    
    const newBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: 'www.testtesttest.com',
      likes: 7357
    }  
   
    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, blogsAtEnd.length)
  
  })

  test('doesn´t succeed (400 Bad Request) when title or uri are missing', async() => {

    const userForTesting = {
      username: 'root',
      password: '1234'
    }

    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)
    
    const noTitleBlog = {
      author: 'test maniac',
      title: '',
      url: 'www.testtesttest.com',
      likes: 7357
    }  

    const noUrlBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: '',
      likes: 7357
    }  

    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(noTitleBlog)
      .expect(400)      
  
    await api
      .post('/api/blogs')
      .set({Authorization: `Bearer ${body.token}`})
      .send(noUrlBlog)
      .expect(400)
  })

  test('succeeds when likes value is not present defaulting to 0', async() => {

    const userForTesting = {
      username: 'root',
      password: '1234'
    }

    const noLikesBlog = {
      author: 'asd',
      title: 'asd',
      url: 'www.asd.com'      
    }

    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)  
  
    await api
      .post('/api/blogs')
      .set({Authorization: `Bearer ${body.token}`})
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd[0].likes, 0)  
  })    
  
  
})

describe('deletion of a blog', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})  
    await User.deleteMany({})
    //sacar esto a un helper luego y usar loop
    const initialUsers = await helper.initialUsers()
    let user = new User(initialUsers[0])
    await user.save()
    user = new User(initialUsers[1])
    await user.save()

    const userForTesting = {
      username: 'root',
      password: '1234'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)
    
    const newBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: 'www.testtesttest.com',
      likes: 7357
    }
  
    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })  

  test('succeeds when the user is valid', async() => {

    const userForTesting = {
      username: 'root',
      password: '1234'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)   
  
    const initialBlogs = await helper.blogsInDB()
  
    const blogToDelete = initialBlogs[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({Authorization: `Bearer ${body.token}`})
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDB()  

    assert.strictEqual(initialBlogs.length - 1, blogsAtEnd.length)    
  })
  test('doesn´t succeed when the user is invalid', async() => {

    const userForTesting = {
      username: 'root',
      password: '1235'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(401)   
  
    const initialBlogs = await helper.blogsInDB()
  
    const blogToDelete = initialBlogs[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({Authorization: `Bearer ${body.token}`})
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDB()  

    assert.strictEqual(initialBlogs.length, blogsAtEnd.length)    
  })
})

describe('update likes', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})  
    await User.deleteMany({})
    //sacar esto a un helper luego y usar loop
    const initialUsers = await helper.initialUsers()
    let user = new User(initialUsers[0])
    await user.save()
    user = new User(initialUsers[1])
    await user.save()

    const userForTesting = {
      username: 'root',
      password: '1234'
    }
    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)
    
    const newBlog = {
      author: 'test maniac',
      title: 'blog for testing',
      url: 'www.testtesttest.com',
      likes: 7357
    }
  
    await api
      .post('/api/blogs')   
      .set({Authorization: `Bearer ${body.token}`})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  }) 
  test('succeeds with if a the user is valid', async() => {
  
    const updateLikes = {
      likes: 20
    }
    const initialBlogs = await helper.blogsInDB() 
    
    const blogToUpdate = initialBlogs[0]

    const userForTesting = {
      username: 'root',
      password: '1234'
    }

    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(200)

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({Authorization: `Bearer ${body.token}`})
      .send(updateLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDB()
  
    assert.strictEqual(blogsAtEnd[0].likes, updateLikes.likes)
  } )

  test('doesn´t succeed if the user is invalid', async() => {
  
    const updateLikes = {
      likes: 20
    }
    const initialBlogs = await helper.blogsInDB() 
    
    const blogToUpdate = initialBlogs[0]

    const userForTesting = {
      username: 'root',
      password: '1235'
    }

    const { body } = await api
      .post('/login')
      .send(userForTesting)
      .expect(401)
      
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({Authorization: `Bearer ${body.token}`})
      .send(updateLikes)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDB()
  
    assert.strictEqual(blogsAtEnd[0].likes, initialBlogs[0].likes)
  } )

})

after(async () => {
  await mongoose.connection.close()
})