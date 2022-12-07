const express = require('express')
const startServer = require('./config/server')
require('dotenv').config()

const error_handler = require('./middlewares/error_handler.middleware')
const routes = require('./routes')

// Start database connection
require('./database')

const server = express()

// Middleware
server.use(express.json())
server.use('/static', express.static('./static'))

// Error handler middleware
server.use(error_handler)

// Endpoints
server.use('/', routes)

// Run server
startServer(server)
