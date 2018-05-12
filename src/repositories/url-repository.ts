import { Url } from '../models'
import { UrlRepository } from '../repositories'

export default class SqlUrlRepository implements UrlRepository {
  private _url = Url

  public async getLastAvailableCount (): Promise<number> {
    const url = await this._url.findOne({ order: [['count', 'DESC']] })

    if (url === null) {
      return 0
    }

    return url.count
  }

  public async getUrlByShortUrl (shortUrl: string): Promise<string | null> {
    const urlInstance = await this._url.findOne({ where: { hash: shortUrl } })
    if (!urlInstance) {
      return null
    }

    return urlInstance.url
  }

  public async createShortUrl (fullUrl: string, shortUrl: string): Promise<void> {
    await this._url.create({ url: fullUrl, hash: shortUrl })
  }
}
