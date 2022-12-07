const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes')
const postRoutes = require('./post.routes')
const loginRoutes = require('./login.routes')
const meteoRoutes = require('./meteo.routes')

router.use('/user', userRoutes)
router.use('/post', postRoutes)
router.use('/', loginRoutes)
router.use('/', meteoRoutes)

module.exports = router
