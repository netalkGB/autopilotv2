import express, { Request, Response } from 'express'
import log4js from 'log4js'
import fetch from 'node-fetch'
import fs from 'fs'
const fsPromsises = fs.promises

const logger = log4js.getLogger('app')
logger.level = 'all'

const app = express()

const access: any = {}

main()

async function main () {
  let config
  try {
    const configData = await fsPromsises.readFile('./config.json')
    config = JSON.parse(configData.toString()) as {port: number, permitIntervalMs: number, useragent: string}
  } catch (e) {
    logger.error('file load error:', e)
    return
  }

  const port = config?.port
  const permitIntervalMs = config?.permitIntervalMs
  const useragent = config?.useragent

  app.get('/request', async (request: Request, response: Response) => {
    logger.info('start GET /request')
    try {
      const url = request.query.url as string
      if (!url) {
        response.status(500).send('parameter error')
        logger.error('parameter error')
        logger.error('!end GET /request')
        return
      }

      if (blockJudge(url, permitIntervalMs)) {
        response.status(429).send('too many request')
        logger.error('blocked: too many request, url:', url)
        logger.error('!end GET /request')
        return
      }

      logger.info('start request:', url)
      const fetchRequest = await fetch(url, {
        headers: {
          'user-agent': useragent
        }
      })
      const text = await fetchRequest.text()
      const statusCode = fetchRequest.status
      response.status(200).send({ text, statusCode })
      logger.info('end request:', url)
      logger.info('end GET /request')
    } catch (e) {
      response.status(500).send('error')
      logger.error('abnormal error:', e)
      logger.error('!end /request')
    }
  })

  app.listen(port, () => logger.info('listen on port', port))
}

// blockならtrue
function blockJudge (url: string, permitMs: number) {
  if (!access[url]) {
    access[url] = Date.now()
    return false
  } else {
    const nowEpoch = Date.now()
    const lastEpoch = access[url]

    const diff = nowEpoch - lastEpoch
    // permitMs以内に再度リクエスト投げてたらBLOCK
    if (diff > permitMs) {
      // 通す
      access[url] = nowEpoch
      return false
    } else {
      // BAN
      return true
    }
  }
}
