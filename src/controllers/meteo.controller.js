const axios = require('axios')
const { readFileSync } = require('fs')

const TOKEN = process.env.EXT_METEO_TOKEN
const weatherCodeJSON = JSON.parse(readFileSync(__dirname + '/../json/meteo_code.json'))

const endpoint = (lat, lng) =>
	'https://api.meteo-concept.com/api/forecast/daily/0?token=' + TOKEN + '&latlng=' + lat + ',' + lng

const convertWeatherCodeToName = code => weatherCodeJSON[code] ?? 'Unknown'

const controllerMeteo = async (req, res, next) => {
	const { lat, lng } = req.query

	try {
		const result = await axios.get(endpoint(lat, lng))
		if (result.status !== 200) {
			res.status(404).json({ message: 'No data found.' })
			return
		}

		const forecast = result.data.forecast
		res.status(200).json({
			wind: {
				speed: forecast.wind10m, // km/h
				gust: forecast.gust10m, // km/h
				direction: forecast.dirwind10m, // (0 - 360) °
			},
			rain: {
				mm: forecast.rr10, // mm
				mm_max: forecast.rr1, // mm
				proba: forecast.probarain, // (0 - 100) %
			},
			temp: {
				min: forecast.tmin, // °C
				max: forecast.tmax, // °C
			},
			weather: {
				code: forecast.weather, // Code
				name: convertWeatherCodeToName(forecast.weather),
			},
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = controllerMeteo
