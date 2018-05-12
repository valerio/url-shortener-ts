import { Express } from 'express'
import { redirectToUrl, postUrl } from '../controllers/url-controller'

export default function initRoutes (app: Express) {
  app.get('/:hash', redirectToUrl)
  app.post('/api/url', postUrl)
}
