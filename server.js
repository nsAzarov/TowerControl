import fetch from 'node-fetch'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { logReq, logRes, logErr, getRandomInt } from './utils/index.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let airstripFreeDate = undefined

app.get('/AirstripState', (_, res) => {
	if (airstripFreeDate && airstripFreeDate > new Date()) {
		logRes('AirstripState', 'Busy')
		res.json('Busy')
	} else {
		airstripFreeDate = new Date(new Date().getTime() + 2 * 60000) // занимаем взлётную полосу на 2 минуты
		logRes('AirstripState', 'Free')
		res.json('Free')
	}
})

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	app.get('*', (_, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT || 4002
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
