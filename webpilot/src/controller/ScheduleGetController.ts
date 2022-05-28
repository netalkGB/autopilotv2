import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/ScheduleServiceImpl'
import log4js from 'log4js'
import { ScheduleResponse } from '../model/ScheduleResponse'

const logger = log4js.getLogger('app')

export const scheduleGetController = async (request: Request, response: Response) => {
  logger.info('start scheduleGetController')
  const scheduleService = new ScheduleServiceImpl(AppDataSource)
  try {
    const schedules = await scheduleService.getSchedule()

    const responseSchedules = schedules.map(s => {
      const responseSchedule = new ScheduleResponse()
      responseSchedule.id = s.id
      responseSchedule.url = s.url
      responseSchedule.name = s.name
      responseSchedule.schedule = s.schedule
      return responseSchedule
    })

    response.send(responseSchedules).status(200)
    logger.info('end scheduleGetController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end scheduleGetController')
    logger.error('error:', e)
  }
}
