const { model, Schema } = require('mongoose')

const userSchema = new Schema({
	login: String,
	password: String,
	picture: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = model('User', userSchema, 'users')
