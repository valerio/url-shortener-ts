export interface UrlRepository {
  getLastAvailableCount (): Promise<number>
  getUrlByShortUrl (shortUrl: string): Promise<string | null>
  createShortUrl (fullUrl: string, shortUrl: string): Promise<void>
}
