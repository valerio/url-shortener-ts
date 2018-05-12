import { Response, Request, NextFunction } from 'express'
import Hashids from 'hashids'
import Joi from 'joi'

import { UrlRepository } from '../repositories'

export class UrlController {
  private repository: UrlRepository
  private hashGenerator: Hashids

  private urlValidationSchema = {
    url: Joi.string().uri({ scheme: ['https', 'http'] }).trim().required()
  }

  constructor (repository: UrlRepository, hashGenerator: Hashids) {
    this.repository = repository
    this.hashGenerator = hashGenerator
  }

  public redirectToUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shortUrl = req.params.hash

      let fullUrl = await this.repository.getUrlByShortUrl(shortUrl)
      if (!fullUrl) {
        return res.status(404).send()
      }

      res.redirect(301, fullUrl)
    } catch (err) {
      next(err)
    }
  }

  public postUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = Joi.validate(
        { url: req.body.url },
        this.urlValidationSchema
      )

      if (error) {
        return res.status(400).send('InvalidUrl')
      }

      const url = value.url

      const lastAvailableCount = await this.repository.getLastAvailableCount()

      const hash = this.hashGenerator.encode(lastAvailableCount)

      await this.repository.createShortUrl(url, hash)

      res.status(201).send(hash)
    } catch (err) {
      next(err)
    }
  }
}
