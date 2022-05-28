import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleService } from '../service/ScheduleService'
import log4js from 'log4js'
import { ScheduleRequest } from '../model/ScheduleRequest'

const logger = log4js.getLogger('app')

export const schedulePutController = async (request: Request, response: Response) => {
  logger.info('start schedulePutController')
  try {
    const scheduleValidator = new ScheduleValidator()
    const scheduleService = new ScheduleService(AppDataSource)
    const body = request.body
    const id = body.id
    const schedleRequest = new ScheduleRequest(body)
    const schedule = schedleRequest.schedule
    if (!schedule || !id) {
      response.send('schedule and id is required.').status(400)
    const schedule = body.schedule
    const name = body.name

    if (!id) {
      response.send('id is required.').status(400)
      logger.info('end schedulePutController')
      return
    }

    if (schedule && !scheduleValidator.validateSchedule(schedule)) {
      response.send('schedule format error.').status(400)
      logger.info('schedule format error.')
      logger.info('end schedulePutController')
      return
    }

    try {
      await scheduleService.updateSchedule(id, schedule, name)
    } catch (e) {
      if (e instanceof Error && e.message === 'not yet registered') {
        response.send('not yet registered').status(400)
        logger.info('end schedulePutController')
        return
      } else {
        throw e
      }
    }

    response.send().status(201)
    logger.info('end schedulePutController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end schedulePutController')
    logger.error('error:', e)
  }
}
