import express from 'express'
import bodyParser from 'body-parser'

import initRoutes from './routes/index'

// Create Express server
const app = express()
app.set('port', process.env.PORT || 8080)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
initRoutes(app)

export default app
