const User = require('../models/user.models')

const dtoUserUpdate = async (req, res, next) => {
	try {
		const username = req.body.username

		// Check if username is a string
		if (typeof username !== 'undefined' && typeof username !== 'string') {
			res.status(400).json({ message: 'Invalid username' })
			return
		}

		// Check if username is already used
		if (req.user.login != username) {
			const userExist = await User.exists({ login: username })
			if (userExist) {
				res.status(401).json({ message: 'Username is not available.' })
				return
			}
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	dtoUserUpdate,
}
