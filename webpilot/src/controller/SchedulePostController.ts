import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleServiceImpl } from '../service/autopilot/ScheduleServiceImpl'
import log4js from 'log4js'
import { ScheduleValidator } from '../validator/ScheduleValidator'
import { Schedule } from '../entity/autopilot/Schedule'
import { RSSServiceImpl } from '../service/autopilot/RSSServiceImpl'
import { ServerConfig } from '../ServerConfig'
import { ScheduleRequest } from '../model/ScheduleRequest'

const logger = log4js.getLogger('app')

export const schedulePostController = async (request: Request, response: Response) => {
  logger.info('start schedulePostController')

  if (!request.token.scope.includes('w')) {
    logger.info('access blocked')
    response.status(404).send()
    return
  }

  try {
    const scheduleValidator = new ScheduleValidator()
    const scheduleService = new ScheduleServiceImpl(AppDataSource.getInstance())
    const rssService = new RSSServiceImpl(ServerConfig.proxyUrl)

    const inputSchedule = new ScheduleRequest(request.body)
    if (!scheduleValidator.validateSchedule(inputSchedule?.schedule)) {
      response.status(400).send('schedule === \'every30minutes\' || schedule === \'every1hour\'')
      return
    }

    if (!scheduleValidator.validateName(inputSchedule?.name)) {
      response.status(400).send('name is required.')
      return
    }

    if (!scheduleValidator.validateURLFormat(inputSchedule?.url)) {
      response.status(400).send('invalid url format.')
      return
    }

    try {
      logger.info('start RSS format check')
      const isValid = await rssService.isValidRSS(inputSchedule?.url)
      if (!isValid) {
        logger.error('RSS format error url:', inputSchedule?.url)
        response.status(400).send('RSS format error')
        logger.info('!end RSS format check')
        logger.error('!end schedulePostController')
        return
      }
      logger.info('valid')
      logger.info('end RSS format check')
    } catch (e) {
      if (e instanceof Error && e.message === 'http error') {
        logger.error('cannot fetch xml:', inputSchedule?.url)
        response.status(400).send('cannot fetch xml')
        logger.info('!end RSS format check')
        logger.error('!end schedulePostController')
        return
      }
    }
    logger.info('end RSS format check')

    const schedule = new Schedule()
    schedule.name = inputSchedule.name
    schedule.url = inputSchedule.url
    schedule.schedule = inputSchedule.schedule
    try {
      await scheduleService.addSchedule(schedule)
    } catch (e) {
      if (e instanceof Error && e.message === 'already registered') {
        response.status(409).send('already registered')
        logger.error('!end schedulePostController')
        return
      } else {
        throw e
      }
    }

    response.status(201).send()
    logger.info('end schedulePostController')
  } catch (e) {
    response.status(500).send('error')
    logger.error('!end schedulePostController')
    logger.error('error:', e)
  }
}
