const logger = require('./logger')

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
    //pregunta: como puedo recuperar este error en back o front end??
    //logger.error(res)    
    return res
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
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

module.exports = { 
  requestLogger,
  errorHandler,
  tokenExtractor
}