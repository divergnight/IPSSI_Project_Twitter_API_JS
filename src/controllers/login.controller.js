const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET

function genToken(id) {
	return jwt.sign(
		{
			id: id,
		},
		SECRET,
		{ expiresIn: '3 hours' }
	)
}

const controllerUserLogin = async (req, res) => {
	try {
		const { login, password } = req.body
		const user = req.user

		bcrypt.compare(password, user.password, (err, result) => {
			if (result) {
				const token = genToken(user._id)

				res.status(200).json({
					username: login,
					token: token,
				})
			} else {
				res.status(401).json({
					message: 'Username or password is invalid.',
				})
			}
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerUserRegister = async (req, res) => {
	try {
		const { login, password } = req.body

		const user = new User()
		bcrypt.hash(password, 10, async (err, hash) => {
			user.login = login
			user.password = hash
			user.picture = ''

			await user.save()
		})

		const token = genToken(user._id)

		res.status(201).json({
			username: login,
			token: token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerUserLogin,
	controllerUserRegister,
}
