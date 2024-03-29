import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigServiceImpl } from '../service/autopilot/ConfigServiceImpl'
import { DiscordConfigResponse } from '../model/DiscordConfigResponse'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigGetController = async (request: Request, response: Response) => {
  logger.info('start discordConfigGetController')

  if (!request.token.scope.includes('r')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  const configService = new ConfigServiceImpl(AppDataSource.getInstance())
  try {
    const discordConfigResponse = new DiscordConfigResponse()
    const url = await configService.getConfigValue(DISCORD_CONFIG_KEY)
    discordConfigResponse.configured = Boolean(url)
    response.status(200).send(discordConfigResponse)
    logger.info('end discordConfigGetController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end discordConfigGetController')
    logger.error('error:', e)
  }
}
