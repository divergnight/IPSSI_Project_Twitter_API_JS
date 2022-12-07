const { postToJson } = require('./post.controller')

const controllerSurveySelect = async (req, res) => {
	try {
		const post = req.post
		const answer = req.answer
		answer.users.push(req.user._id)
		await answer.save()

		await Promise.all(
			req.other_answers.map(async answer => {
				if (answer.users.includes(req.user._id)) {
					answer.users.splice(
						answer.users.findIndex(v => v._id == req.user._id),
						1
					)
					await answer.save()
				}
			})
		)

		return res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerSurveyCancel = async (req, res) => {
	try {
		const post = req.post
		const answer = req.answer
		answer.users.splice(
			answer.users.findIndex(v => v._id == req.user._id),
			1
		)
		await answer.save()

		return res.status(200).json(await postToJson(post))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerSurveySelect,
	controllerSurveyCancel,
}
