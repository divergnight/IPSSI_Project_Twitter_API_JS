const express = require('express')
const router = express.Router()

const isAuthenticated = require('../middlewares/auth.middleware')
const { uploadImg } = require('../middlewares/storage.middleware')
const controller = require('../controllers/user.controller')
const dto = require('../dto/user.dto')

router.get('/', isAuthenticated, controller.controllerUserGet)
router.patch('/', isAuthenticated, uploadImg, dto.dtoUserUpdate, controller.controllerUserUpdate)
router.delete('/', isAuthenticated, controller.controllerUserDelete)

module.exports = router
