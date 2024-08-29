const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
// const { tokenExtractor } = require('../utils/middleware')

blogsRouter.get('/api/blogs', async (request, response) => {

  try {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1})
    response.json(blogs)
  } catch(exception) {
    logger.error(exception)
  }     
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
    
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.body.token, process.env.SECRET)
  
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id) 
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

  } catch(error) {    
    next(error)
  }  
})

blogsRouter.delete('/api/blogs/:id', async(request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.body.token, process.env.SECRET)
  
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const loggedUser = await User.findById(decodedToken.id)
    const blogToDelete = await Blog.findById(request.params.id)

    if( loggedUser.id.toString() === blogToDelete.user.toString()) {
      await blogToDelete.delete()
      response.status(204).json(blogToDelete)
    } else {
      response.status(401).json({ error: 'can´t delete a blog belonging to other user'})
    }  
    
  } catch(error) {
    next(error)
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
