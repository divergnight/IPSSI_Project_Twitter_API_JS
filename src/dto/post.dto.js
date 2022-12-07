const Post = require('../models/post.models')

const dtoPostGetAll = async (req, res, next) => {
	try {
		const { limit, offset } = req.query

		// Check if limit is a positive integer
		if (limit) {
			if (isNaN(Number(limit)) || limit < 0) {
				res.status(400).json({ message: 'The limit query parameter must be a number, greater than 0.' })
				return
			}
		}
		req.query.limit = Number(req.query.limit ?? '10')

		// Check if offset is a positive integer
		if (offset) {
			if (isNaN(Number(offset)) || offset < 0) {
				res.status(400).json({ message: 'The offset query parameter must be a number, greater than 0.' })
				return
			}
		} else req.query.offset = 0

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostCreate = async (req, res, next) => {
	try {
		const { content, survey } = req.body

		// Check if content is a string
		if (typeof content !== 'string') {
			res.status(400).json({ message: 'The post content is missing or invalid.' })
			return
		}

		// Only allow post between 1 and 400 characters
		if (!content.length && content.length <= 400) {
			res.status(400).json({
				message: 'The post must be between 1 and 400 characters long.',
			})
			return
		}

		// If have a sondage in post
		if (survey) {
			// Check if subject is a string
			if (typeof survey.subject !== 'string') {
				res.status(400).json({ message: 'The survey subject is missing or invalid.' })
				return
			}

			// Only allow survey subject between 1 and 80 characters
			if (!survey.subject.length && survey.subject.length <= 80) {
				res.status(400).json({
					message: 'The survey subject must be between 1 and 80 characters long.',
				})
				return
			}

			// Check if answer is a string
			if (!(Array.isArray(survey.answers) && survey.answers.every(v => typeof v === 'string'))) {
				res.status(400).json({ message: 'The survey content is invalid.' })
				return
			}

			// Check answers count
			if (survey.answers.length < 2 || survey.answers.length > 4) {
				res.status(400).json({ message: 'The survey must have between 2 and 4 responses.' })
				return
			}

			// Only if all answers have length between 1 and 80 characters
			if (!survey.answers.every(v => v.length <= 80)) {
				res.status(400).json({
					message: 'The survey answers must be between 1 and 80 characters long.',
				})
				return
			}
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostGet = async (req, res, next) => {
	try {
		const id_post = req.params.id_post

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post).populate('author', { login: 1, picture: 1 })
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		req.post = post

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostUpdate = async (req, res, next) => {
	try {
		const id_post = req.params.id_post
		const { content, survey } = req.body

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if content is a string
		if (typeof content !== 'string') {
			res.status(400).json({ message: 'The post content is missing or invalid.' })
			return
		}

		// Only allow post between 1 and 400 characters
		if (!content.length && content.length <= 400) {
			res.status(400).json({
				message: 'The post must be between 1 and 400 characters long.',
			})
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post).populate('author', { login: 1, picture: 1 })
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		// Check if the request comes from the author of the post
		if (`${post.author?._id}` !== `${req.user._id}`) {
			res.status(403).json({ message: 'You do not own the rights to this post.' })
			return
		}

		// If have a sondage in post
		if (post.survey && survey) {
			// Check if subject is a string
			if (typeof survey.subject !== 'string') {
				res.status(400).json({ message: 'The survey subject is missing or invalid.' })
				return
			}

			// Only allow survey subject between 1 and 80 characters
			if (!survey.subject.length && survey.subject.length <= 80) {
				res.status(400).json({
					message: 'The survey subject must be between 1 and 80 characters long.',
				})
				return
			}

			// Check if answer is a string
			if (!(Array.isArray(survey.answers) && survey.answers.every(v => typeof v === 'string'))) {
				res.status(400).json({ message: 'The survey content is invalid.' })
				return
			}

			// Check answers count
			if (survey.answers.length < 2 || survey.answers.length > 4) {
				res.status(400).json({ message: 'The survey must have between 2 and 4 responses.' })
				return
			}

			// Only if all answers have length between 1 and 80 characters
			if (!survey.answers.every(v => v.length <= 80)) {
				res.status(400).json({
					message: 'The survey answers must be between 1 and 80 characters long.',
				})
				return
			}
		}

		req.post = post

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostDelete = async (req, res, next) => {
	try {
		const id_post = req.params.id_post

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post)
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		// Check if the request comes from the author of the post
		if (`${post.author._id}` !== `${req.user._id}`) {
			res.status(403).json({ message: 'You do not own the rights to this post.' })
			return
		}

		req.post = post

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostLike = async (req, res, next) => {
	try {
		const id_post = req.params.id_post

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post).populate('author', { login: 1, picture: 1 })
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		// Check if the user not have already like this post
		if (post.likes.includes(req.user._id)) {
			res.status(403).json({ message: 'You have already like this post' })
			return
		}

		req.post = post

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPostUnlike = async (req, res, next) => {
	try {
		const id_post = req.params.id_post

		// Check if the params id_post exists
		if (!id_post || id_post.length !== 24) {
			res.status(400).json({ message: 'Please enter a valid post id.' })
			return
		}

		// Check if the post exists
		const post = await Post.findById(id_post).populate('author', { login: 1, picture: 1 })
		if (!post) {
			res.status(404).json({ message: 'Post not found.' })
			return
		}

		// Check if the user have like this post
		if (!post.likes.includes(req.user._id)) {
			res.status(403).json({ message: 'You have not like this post' })
			return
		}

		req.post = post

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	dtoPostGetAll,
	dtoPostCreate,
	dtoPostGet,
	dtoPostUpdate,
	dtoPostDelete,
	dtoPostLike,
	dtoPostUnlike,
}
