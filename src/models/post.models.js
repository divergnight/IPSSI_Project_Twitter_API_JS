const { model, Schema } = require('mongoose')

const postSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	content: String,
	survey: String,
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	postedAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = model('Post', postSchema, 'posts')
