const express = require('express')
const router = express.Router()

const isAuthenticated = require('../middlewares/auth.middleware')
const postController = require('../controllers/post.controller')
const postDto = require('../dto/post.dto')
const surveyController = require('../controllers/survey.controller')
const surveyDto = require('../dto/survey.dto')

router.get('/', postDto.dtoPostGetAll, postController.controllerPostGetAll)
router.post('/', isAuthenticated, postDto.dtoPostCreate, postController.controllerPostCreate)
router.get('/:id_post', postDto.dtoPostGet, postController.controllerPostGet)
router.patch('/:id_post', isAuthenticated, postDto.dtoPostUpdate, postController.controllerPostUpdate)
router.delete('/:id_post', isAuthenticated, postDto.dtoPostDelete, postController.controllerPostDelete)

router.post('/:id_post/like', isAuthenticated, postDto.dtoPostLike, postController.controllerPostLike)
router.delete('/:id_post/unlike', isAuthenticated, postDto.dtoPostUnlike, postController.controllerPostUnlike)

router.post(
	'/:id_post/survey/:id_answer',
	isAuthenticated,
	surveyDto.dtoSurveySelect,
	surveyController.controllerSurveySelect
)
router.delete(
	'/:id_post/survey/:id_answer',
	isAuthenticated,
	surveyDto.dtoSurveyCancel,
	surveyController.controllerSurveyCancel
)

module.exports = router
