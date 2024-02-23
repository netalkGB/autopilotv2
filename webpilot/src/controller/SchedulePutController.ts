import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/autopilot/ScheduleServiceImpl'
import log4js from 'log4js'
import { ScheduleRequest } from '../model/ScheduleRequest'
import { ScheduleValidator } from '../validator/ScheduleValidator'

const logger = log4js.getLogger('app')

export const schedulePutController = async (request: Request, response: Response) => {
  logger.info('start schedulePutController')

  if (!request.token.scope.includes('w')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  try {
    const scheduleValidator = new ScheduleValidator()
    const scheduleService = new ScheduleServiceImpl(AppDataSource.getInstance())
    const body = request.body
    const id = body.id
    const scheduleRequest = new ScheduleRequest(body)
    const schedule = scheduleRequest.schedule
    const name = body.name

    if (!id) {
      response.status(400).send('id is required.')
      logger.info('end schedulePutController')
      return
    }

    if (schedule && !scheduleValidator.validateSchedule(schedule)) {
      response.status(400).send('schedule format error.')
      logger.info('schedule format error.')
      logger.info('end schedulePutController')
      return
    }

    try {
      await scheduleService.updateSchedule(id, schedule, name)
    } catch (e) {
      if (e instanceof Error && e.message === 'not yet registered') {
        response.status(400).send('not yet registered')
        logger.info('end schedulePutController')
        return
      } else {
        throw e
      }
    }

    response.status(201).send()
    logger.info('end schedulePutController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end schedulePutController')
    logger.error('error:', e)
  }
}
