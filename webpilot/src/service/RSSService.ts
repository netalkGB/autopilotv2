export interface RSSService {
  getLatestPostUrl(url: string): Promise<string>

  isValidRSS(url: string): Promise<boolean>
}
