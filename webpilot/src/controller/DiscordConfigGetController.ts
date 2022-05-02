import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigService } from '../service/ConfigService'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigGetController = async (request: Request, response: Response) => {
  logger.info('start discordConfigGetController')
  const configService = new ConfigService(AppDataSource)
  try {
    const url = await configService.getConfigValue(DISCORD_CONFIG_KEY)
    if (url) {
      response.send(JSON.stringify({ configured: true })).status(200)
    } else {
      response.send(JSON.stringify({ configured: false })).status(200)
    }
    logger.info('end discordConfigGetController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end discordConfigGetController')
    logger.error('error:', e)
  }
}
