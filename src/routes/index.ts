import urlRoutes from './url-routes'
import { Express } from 'express'

export default function initRoutes (app: Express) {
  urlRoutes(app)
}
