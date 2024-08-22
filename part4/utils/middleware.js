const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}


const errorHandler = (error, request, response, next) => {
  // logger.error(error.message)
  if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {    
    const res = response.status(400).json({ error: 'expected `username` to be unique' })
    //pregunta: como puedo recuperar este error en back o front end??
    //logger.error(res)
    return res
  }
 
  next(error)
}

module.exports = { 
  requestLogger,
  errorHandler
}