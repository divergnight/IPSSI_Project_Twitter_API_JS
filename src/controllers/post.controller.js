const Post = require('../models/post.models')
const Choice = require('../models/choice_sondage.models')

const postToJson = async (post, user = null) => {
	// Get all answers
	let answers = (await Choice.find({ post: post._id })).map(v => {
		return {
			title: v.title,
			total: v.users.length,
		}
	})
	const total = answers.reduce((p, c) => c.total + p, 0)

	answers = answers.map(v => {
		v.percent = total ? v.total / total : 0
		delete v.total
		return v
	})

	// Get author
	const author = user ?? post.author

	// Generate json
	const json = {
		id: post.id,
		author: author
			? {
					id: author._id,
					username: author.login,
					picture: author.picture,
			  }
			: null,
		content: post.content,
		likes: post.likes.length,
	}
	if (post.survey) {
		json.survey = {
			subject: post.survey,
			answers: answers,
		}
	}
	return json
}

const reqUrl = req => req.protocol + '://' + req.get('host') + req.originalUrl.split('?').shift()

const controllerPostGetAll = async (req, res) => {
	try {
		let { limit, offset } = req.query
		[limit, offset] = [Number(limit), Number(offset)]

		const posts = await Post.find().limit(5).skip().populate('author', { login: 1, picture: 1 }).sort({ createdAt: -1 })
		const data = await Promise.all(
			posts.slice(offset, offset + limit).map(async post => {
				return postToJson(post)
			})
		)
		const next = data.length + offset >= posts.length ? null : reqUrl(req) + `?limit=${limit}&offset=${offset + limit}`
		const previous =
			offset == 0
				? null
				: reqUrl(req) + `?limit=${offset - limit < 0 ? offset : limit}&offset=${Math.max(0, offset - limit)}`

		res.status(200).json({
			count: data.length,
			next: next,
			previous: previous,
			results: data,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostCreate = async (req, res) => {
	try {
		const post = new Post({
			author: req.user._id,
			content: req.body.content,
		})
		if (req.body.survey) {
			const { subject, answers } = req.body.survey
			post.survey = subject
			await post.save()
			await Promise.all(
				answers.map(async e => {
					const answer = new Choice({
						post: post._id,
						title: e,
					})
					await answer.save()
				})
			)
		} else {
			await post.save()
		}

		res.status(201).json(await postToJson(post, req.user))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostGet = async (req, res) => {
	try {
		const post = req.post

		res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostUpdate = async (req, res) => {
	try {
		const post = req.post

		if (req.body.content) post.content = req.body.content
		if (post.survey && req.body.survey) {
			const { subject, answers } = req.body.survey
			post.survey = subject
			await post.save()
			await Choice.deleteMany({ post: post._id })
			await Promise.all(
				answers.map(async e => {
					const answer = new Choice({
						post: post._id,
						title: e,
					})
					await answer.save()
				})
			)
		} else {
			await post.save()
		}

		return res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostDelete = async (req, res) => {
	try {
		const post = req.post
		await Choice.deleteMany({ post: post._id })
		await post.remove()
		return res.status(204).json()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostLike = async (req, res) => {
	try {
		const post = req.post
		post.likes.push(req.user._id)
		await post.save()

		return res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPostUnlike = async (req, res) => {
	try {
		const post = req.post
		post.likes.splice(
			post.likes.findIndex(v => v._id == req.user._id),
			1
		)
		await post.save()

		return res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerPostGetAll,
	controllerPostCreate,
	controllerPostGet,
	controllerPostUpdate,
	controllerPostDelete,
	controllerPostLike,
	controllerPostUnlike,
	postToJson,
}
