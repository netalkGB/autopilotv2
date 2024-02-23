import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigServiceImpl } from '../service/autopilot/ConfigServiceImpl'
import { DiscordConfigRequest } from '../model/DiscordConfigRequest'
import { NotificationServiceImpl } from '../service/autopilot/NotificationServiceImpl'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigPutController = async (request: Request, response: Response) => {
  logger.info('start discordConfigPutController')

  if (!request.token.scope.includes('w')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  try {
    const configService = new ConfigServiceImpl(AppDataSource.getInstance())
    const notificationService = new NotificationServiceImpl(configService)

    const body = request.body
    const discordRequest = new DiscordConfigRequest(body)
    const discordWebHookUrl = discordRequest.discordWebHookUrl
    if (!discordWebHookUrl) {
      response.status(400).send('discordWebHookUrl is required.')
      logger.info('end discordConfigPutController')
      return
    }

    await configService.setConfig(DISCORD_CONFIG_KEY, discordWebHookUrl)
    await notificationService.notify('test message from apbot.')

    response.status(201).send()
    logger.info('end discordConfigPutController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end discordConfigPutController')
    logger.error('error:', e)
  }
}
