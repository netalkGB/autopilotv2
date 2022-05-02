import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigService } from '../service/ConfigService'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigDeleteController = async (request: Request, response: Response) => {
  logger.info('start discordConfigDeleteController')
  try {
    const configService = new ConfigService(AppDataSource)

    await configService.setConfig(DISCORD_CONFIG_KEY, '')
    response.send().status(201)
    logger.info('end discordConfigDeleteController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end discordConfigDeleteController')
    logger.error('error:', e)
  }
}
