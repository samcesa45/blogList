const logger = require("./logger.js")

const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method)
    logger.info('path: ', req.path)
    logger.info('body: ', req.body)
    logger.info('---')
    next()
}


const errorHandler = (error, req,res,next) => {
   logger.info(error.message)

   if(error.name === 'CastError'){
    return res.status(400).send({error:'malformatted id'})
   }else if(error.name === 'ValidationError'){
    return res.status(400).json({error:error.message})
   }

   next(error)
}


const unknownEndpoint = (req,res) => {
    return res.status(404).send({error:'unknown endpoint'})
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}