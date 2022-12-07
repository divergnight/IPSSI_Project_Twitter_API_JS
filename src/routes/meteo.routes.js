const express = require('express')
const router = express.Router()

const dtoMeteo = require('../dto/meteo.dto')
const controllerMeteo = require('../controllers/meteo.controller')

router.get('/meteo', dtoMeteo, controllerMeteo)

module.exports = router
