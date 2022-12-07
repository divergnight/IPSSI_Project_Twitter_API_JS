const { model, Schema } = require('mongoose')

const SurveyAnswerSchema = new Schema({
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
	},
	title: String,
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

module.exports = model('SurveyAnswer', SurveyAnswerSchema, 'survey_answers')
