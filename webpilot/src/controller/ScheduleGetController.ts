import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleService } from '../service/ScheduleService'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const scheduleGetController = async (request: Request, response: Response) => {
  logger.info('start scheduleGetController')
  const scheduleService = new ScheduleService(AppDataSource)
  try {
    const schedule = await scheduleService.getSchedule()
    response.send(schedule).status(200)
    logger.info('end scheduleGetController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end scheduleGetController')
    logger.error('error:', e)
  }
}
