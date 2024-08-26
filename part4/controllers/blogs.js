const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/api/blogs', async (request, response) => {

  try {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1})
    // console.log('operation returned the following blogs', blogs)
    response.json(blogs)
  } catch(exception) {
    logger.error(exception)
  }
     
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
  
  const body = request.body

  try {
    const user = await User.findById(body.userId) 
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })
    if(!blog.title || !blog.url) {
      response.status(400).json({error: "No title or url present"})
    } 
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    const savedUser = await user.save()   
    response.status(201).json(savedBlog)

  } catch(exception) {
    next(exception)
  }
  
})

blogsRouter.delete('/api/blogs/:id', async(request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    logger.error(exception)
  }
})

blogsRouter.put('/api/blogs/:id', async(request, response) => {
  
   const blog = {   
    likes: request.body.likes
  }

  try {
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.status(201).json(updatedNote)
  } catch(exception) {
    logger.error(exception)
  }
})


module.exports = blogsRouter
