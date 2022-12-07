const dtoMeteo = async (req, res, next) => {
	try {
		const { lat, lng } = req.query

		// Check if lat is in query
		if (!lat) {
			res.status(400).json({ message: 'Please add a latitude in the query.' })
			return
		}

		// Check if lng is in query
		if (!lng) {
			res.status(400).json({ message: 'Please add a longitude in the query.' })
			return
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = dtoMeteo
