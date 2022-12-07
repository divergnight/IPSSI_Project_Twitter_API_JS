const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './static')
	},
	filename: function (req, file, cb) {
		cb(null, req.user._id + '-' + file.originalname)
	},
})

const uploadImg = multer({ storage: storage }).single('picture')

module.exports = {
	uploadImg,
}
