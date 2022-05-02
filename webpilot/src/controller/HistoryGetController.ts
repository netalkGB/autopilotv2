import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleService } from '../service/ScheduleService'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const historyGetController = async (request: Request, response: Response) => {
  logger.info('start historyGetController')
  const scheduleService = new ScheduleService(AppDataSource)
  try {
    const history = await scheduleService.getHistory()
    response.send(history).status(200)
    logger.info('end historyGetController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end historyGetController')
    logger.error('error:', e)
  }
}
