import fetch from 'node-fetch'
import { XMLParser } from 'fast-xml-parser'
import { RSSService } from './RSSService'

export class RSSServiceImpl implements RSSService {
  private proxyUrl: string

  constructor (proxyUrl: string) {
    this.proxyUrl = proxyUrl
  }

  public async getLatestPostUrl (url: string) {
    const text = await this.proxyHTTPRequest(url)
    const xml = this.parseXML(text)
    const rdfLatestPostLink = xml['rdf:RDF']?.item[0]?.link
    const rssLatestPostLink = xml.rss?.channel?.item[0]?.link
    return rdfLatestPostLink || rssLatestPostLink
  }

  public async isValidRSS (url: string): Promise<boolean> {
    const text = await this.httpRequest(url)
    try {
      const xml = this.parseXML(text)
      return Boolean(xml['rdf:RDF']) || Boolean(xml.rss?.channel)
    } catch (e) {
      return false
    }
  }

  private parseXML (text: string) {
    return new XMLParser().parse(text)
  }

  private async proxyHTTPRequest (url: string) {
    const params = {
      url
    }
    const queryParams = new URLSearchParams(params)
    const requestUrl = `${this.proxyUrl}?${queryParams}`
    const response = await fetch(requestUrl)
    if (!response.ok) {
      throw new Error(`proxy error: ${response.status}`)
    }
    const proxyResponse = (await response.json()) as { text: string, statusCode: number }
    const { text, statusCode } = proxyResponse
    if (statusCode >= 300 || statusCode < 200) {
      throw new Error(`http error: ${statusCode}`)
    }
    return text
  }

  private async httpRequest (url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('http error')
    }
    return await response.text()
  }
}
