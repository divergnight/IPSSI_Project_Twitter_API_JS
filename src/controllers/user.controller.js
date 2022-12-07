const fs = require('fs')

const rm = url => {
	if (!url) return
	const pictureParts = url.split('/')
	fs.rmSync('./static/' + pictureParts[pictureParts.length - 1])
}

const controllerUserGet = async (req, res) => {
	try {
		const user = req.user

		res.status(200).json({
			username: user.login,
			picture: user.picture,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerUserUpdate = async (req, res) => {
	try {
		const user = req.user

		if (req.body.username) user.login = req.body.username
		if (req.file) {
			rm(user.picture)
			user.picture = 'https://dev.vadn:3000/' + req.file.path.replace('\\', '/')
		}

		await user.save()

		res.status(200).json({
			username: user.login,
			picture: user.picture,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerUserDelete = async (req, res) => {
	try {
		const user = req.user

		rm(user.picture)
		await user.remove()

		res.status(204).json()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerUserGet,
	controllerUserUpdate,
	controllerUserDelete,
}
