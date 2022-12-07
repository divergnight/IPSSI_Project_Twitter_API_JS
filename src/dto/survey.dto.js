const Post = require('../models/post.models')
const Choice = require('../models/choice_sondage.models')

const dtoSurvey = async (req, res, next) => {
	try {
		const id_post = req.params.id_post
		const id_answer = req.params.id_answer

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if the id answer id valid
		if (!id_answer) {
			res.status(400).json({ message: 'Please enter a valid answer index.' })
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post).populate('author', { login: 1, picture: 1 })
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		// Check if the post have survey
		if (!post.survey) {
			res.status(404).json({ message: 'This post has no survey.' })
			return
		}

		// Check if the id answer id valid
		const answers = await Choice.find({ post: post._id })
		if (id_answer > answers.length || id_answer < 0) {
			res.status(400).json({ message: 'The answer index is invalid. Out of range.' })
			return
		}

		req.post = post

		return next(answers)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoSurveySelect = (req, res, next) => {
	dtoSurvey(req, res, async answers => {
		try {
			const id_answer = req.params.id_answer

			// Check if the user not already select this choice
			if (!!answers[id_answer].users.filter(e => e.equals(req.user._id)).length) {
				res.status(400).json({ message: 'You have already select this answer.' })
				return
			}

			req.answer = answers.splice(id_answer, 1)[0]
			req.other_answers = answers

			return next()
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'An error has occurred.' })
		}
	})
}

const dtoSurveyCancel = (req, res, next) => {
	dtoSurvey(req, res, async answers => {
		try {
			const id_answer = req.params.id_answer

			// Check if the user have select this choice
			if (!answers[id_answer].users.filter(e => e.equals(req.user._id)).length) {
				res.status(400).json({ message: 'You have not select this choice' })
				return
			}

			req.answer = answers[id_answer]

			return next()
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'An error has occurred.' })
		}
	})
}

module.exports = {
	dtoSurveySelect,
	dtoSurveyCancel,
}
