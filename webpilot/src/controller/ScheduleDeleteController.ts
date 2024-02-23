import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/autopilot/ScheduleServiceImpl'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const scheduleDeleteController = async (request: Request, response: Response) => {
  logger.info('start scheduleDeleteController')

  if (!request.token.scope.includes('w')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  try {
    const scheduleService = new ScheduleServiceImpl(AppDataSource.getInstance())
    const id = request.query.id as string
    if (!id) {
      response.status(400).send('id is required.')
      logger.info('end schedulePutController')
      return
    }
    await scheduleService.deleteSchedule(id)
    response.status(201).send()
    logger.info('end scheduleDeleteController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end scheduleDeleteController')
    logger.error('error:', e)
  }
}
