import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ConfigServiceImpl } from '../service/ConfigServiceImpl'
import { DiscordConfigRequest } from '../model/DiscordConfigRequest'
import { NotificationServiceImpl } from '../service/NotificationServiceImpl'

const logger = log4js.getLogger('app')

const DISCORD_CONFIG_KEY = 'discordWebHookUrl'

export const discordConfigPutController = async (request: Request, response: Response) => {
  logger.info('start discordConfigPutController')
  try {
    const configService = new ConfigServiceImpl(AppDataSource)
    const notificationService = new NotificationServiceImpl(configService)

    const body = request.body
    const discordRequest = new DiscordConfigRequest(body)
    const discordWebHookUrl = discordRequest.discordWebHookUrl
    if (!discordWebHookUrl) {
      response.send('discordWebHookUrl is required.').status(400)
      logger.info('end discordConfigPutController')
      return
    }

    await configService.setConfig(DISCORD_CONFIG_KEY, discordWebHookUrl)
    await notificationService.notify('test message from apbot.')

    response.send().status(201)
    logger.info('end discordConfigPutController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end discordConfigPutController')
    logger.error('error:', e)
  }
}
