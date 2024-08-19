const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  // console.log('operation returned the following blogs', blogs)
  response.json(blogs)
   
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
   
  response.status(201).json(savedBlog)
})


module.exports = blogsRouter
