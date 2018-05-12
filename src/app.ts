import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

import initRoutes from './routes/index'

// Create Express server
const app = express()

app.set('port', process.env.PORT || 8080)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

initRoutes(app)

app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    return next()
  }

  res.status(500).send()
})

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).send()
})

export default app
