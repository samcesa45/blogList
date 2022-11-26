const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./middleware/error.js')
const blogRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')
const app = express()

const url = config.MONGODB_URI
const run = async () => {
     await mongoose.connect(url)
    logger.info('connected')
    logger.info('blogs saved!')
}

run().catch(error => logger.error('error connecting to MongoDB',error.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)


app.use('/api/blogs',blogRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app


