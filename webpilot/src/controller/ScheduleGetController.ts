import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/autopilot/ScheduleServiceImpl'
import log4js from 'log4js'
import { ScheduleResponse } from '../model/ScheduleResponse'

const logger = log4js.getLogger('app')

export const scheduleGetController = async (request: Request, response: Response) => {
  logger.info('start scheduleGetController')

  if (!request.token.scope.includes('r')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  const scheduleService = new ScheduleServiceImpl(AppDataSource.getInstance())
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

    response.status(200).send(responseSchedules)
    logger.info('end scheduleGetController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end scheduleGetController')
    logger.error('error:', e)
  }
}
