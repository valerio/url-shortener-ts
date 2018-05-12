import { Response, Request, NextFunction } from 'express'
import Hashids from 'hashids'
import config from 'config'
import Joi from 'joi'

import { UrlRepository } from '../repositories'
import SqlUrlRepository from '../repositories/url-repository'

const urlRepository: UrlRepository = new SqlUrlRepository()
const hashGenerator: Hashids = new Hashids(config.get('hashids.salt'), config.get('hashids.minLength'))

const urlValidationSchema = {
  url: Joi.string().uri({ scheme: ['https', 'http'] }).trim().required()
}

export async function redirectToUrl (req: Request, res: Response, next: NextFunction) {
  try {
    const shortUrl = req.params.hash

    let fullUrl = await urlRepository.getUrlByShortUrl(shortUrl)
    if (!fullUrl) {
      return res.status(404).send()
    }

    res.redirect(301, fullUrl)
  } catch (err) {
    next(err)
  }
}

export async function postUrl (req: Request, res: Response, next: NextFunction) {
  try {
    const { error, value } = Joi.validate(
      { url: req.body.url },
      urlValidationSchema
    )

    if (error) {
      return res.status(400).send('InvalidUrl')
    }

    const url = value.url

    const lastAvailableCount = await urlRepository.getLastAvailableCount()

    const hash = hashGenerator.encode(lastAvailableCount)

    await urlRepository.createShortUrl(url, hash)

    res.status(201).send(hash)
  } catch (err) {
    next(err)
  }
}
