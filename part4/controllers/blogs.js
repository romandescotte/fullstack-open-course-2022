const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/api/blogs', async (request, response) => {

  try {
    const blogs = await Blog.find({})
    // console.log('operation returned the following blogs', blogs)
    response.json(blogs)
  } catch(exception) {
    logger.error(exception)
  }
     
})

blogsRouter.post('/api/blogs', async (request, response) => {
  
  const body = request.body
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0
  })

  try {
    if(!blog.title || !blog.url) {
      response.status(400).end("No title or url present")
    } else {
      const savedBlog = await blog.save()
     
      response.status(201).json(savedBlog)
    }
  } catch(exception) {
    logger.error(exception)
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
