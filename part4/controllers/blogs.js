const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {

  try {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1})
    response.json(blogs)
  } catch(exception) {
    logger.error(exception)
  }     
})

blogsRouter.post('/', middleware.userExtractor,async (request, response, next) => {
    
  try {
    const { body } = request
    const { userId } = body    
    // en la request viene el token Y el userId
    console.log('body', body)
   
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      user: userId
    })

    if(!blog.title || !blog.url) {
      return response.status(400).json({error: "No title or url present"})
    } 
       
    const savedBlog = await blog.save()
    const user = await User.findOne({ _id: userId })
    if(!user) {
      return response.status(400).json({error: "No user found"})
    }
    
    user.blogs = user.blogs.concat(savedBlog._id)
    const savedUser = await user.save()   
    response.status(201).json(savedBlog)   

  } catch(error) {    
    next(error)
  }  
})

blogsRouter.delete('/:id', middleware.userExtractor, async(request, response, next) => {

  try {
    const loggedUser = await User.findById(request.body.userId) 
    const blogToDelete = await Blog.findById(request.params.id)
    console.log(loggedUser)
    if( loggedUser.id.toString() === blogToDelete.user.toString()) {
      await blogToDelete.delete()
      response.status(204).json(blogToDelete)
    } else {
      response.status(401).json({ error: 'can´t delete a blog belonging to other user'})
    }  
  } catch (error) {
    next(error)
  }
    
    
  
})

blogsRouter.put('/:id', async(request, response) => {
  
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
