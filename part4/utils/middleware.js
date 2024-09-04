const logger = require('./logger')
const jwt = require('jsonwebtoken')
// const fs = require('fs')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    const res = response.status(400).json({ error: 'expected `username` to be unique' })
    return res
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TypeError') {
    return response.status(404).json({ error: `${error.stack}` })
  }
  next(error)

}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')) {
    request.body.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.body.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.body.userId = decodedToken.id
  // fs.writeFile('request.txt', JSON.stringify(request.body), err => {
  //   if (err) throw err;
  //   console.log('request.txt successfully written to disk');
  // })
  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor
}