import { Express } from 'express'
import config from 'config'
import { UrlController } from '../controllers/url-controller'
import SqlUrlRepository from '../repositories/url-repository'
import Hashids from 'hashids'

export default function initRoutes (app: Express) {
  let urlController = new UrlController(
    new SqlUrlRepository(),
    new Hashids(config.get('hashids.salt'), config.get('hashids.minLength')))

  app.get('/:hash', urlController.redirectToUrl)
  app.post('/api/url', urlController.postUrl)
}
