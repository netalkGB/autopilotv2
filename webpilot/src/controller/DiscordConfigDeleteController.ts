import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigServiceImpl } from '../service/autopilot/ConfigServiceImpl'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigDeleteController = async (request: Request, response: Response) => {
  logger.info('start discordConfigDeleteController')

  if (!request.token.scope.includes('w')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  try {
    const configService = new ConfigServiceImpl(AppDataSource.getInstance())

    await configService.setConfig(DISCORD_CONFIG_KEY, '')
    response.status(201).send()
    logger.info('end discordConfigDeleteController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end discordConfigDeleteController')
    logger.error('error:', e)
  }
}
