import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/autopilot/ScheduleServiceImpl'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const scheduleDeleteController = async (request: Request, response: Response) => {
  logger.info('start scheduleDeleteController')
  try {
    const scheduleService = new ScheduleServiceImpl(AppDataSource)
    const id = request.query.id as string
    if (!id) {
      response.send('id is required.').status(400)
      logger.info('end schedulePutController')
      return
    }
    await scheduleService.deleteSchedule(id)
    response.send().status(201)
    logger.info('end scheduleDeleteController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end scheduleDeleteController')
    logger.error('error:', e)
  }
}
