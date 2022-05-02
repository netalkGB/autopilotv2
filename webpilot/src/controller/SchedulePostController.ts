import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleService } from '../service/ScheduleService'
import log4js from 'log4js'
import { ScheduleValidator } from '../validator/ScheduleValidator'
import { Schedule } from '../entity/Schedule'
import { RSSService } from '../service/RSSService'
import { ServerConfig } from '../ServerConfig'

const logger = log4js.getLogger('app')

export const schedulePostController = async (request: Request, response: Response) => {
  logger.info('start schedulePostController')
  try {
    const scheduleValidator = new ScheduleValidator()
    const scheduleService = new ScheduleService(AppDataSource)
    const rssService = new RSSService(ServerConfig.proxyUrl)

    const inputSchedule = request.body
    if (!scheduleValidator.validateSchedule(inputSchedule?.schedule)) {
      response.send('schedule === \'every30minutes\' || schedule === \'every1hour\'').status(400)
      return
    }

    if (!scheduleValidator.validateName(inputSchedule?.name)) {
      response.send('name is required.').status(400)
      return
    }

    if (!scheduleValidator.validateURLFormat(inputSchedule?.url)) {
      response.send('invalid url format.').status(400)
      return
    }

    try {
      logger.info('start RSS format check')
      const isValid = await rssService.isValidRSS(inputSchedule?.url)
      if (!isValid) {
        logger.error('RSS format error url:', inputSchedule?.url)
        response.send('RSS format error').status(400)
        logger.info('!end RSS format check')
        logger.error('!end schedulePostController')
        return
      }
      logger.info('valid')
      logger.info('end RSS format check')
    } catch (e) {
      if (e instanceof Error && e.message === 'http error') {
        logger.error('cannot fetch xml:', inputSchedule?.url)
        response.send('cannot fetch xml').status(400)
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
        response.send('already registered').status(409)
        logger.error('!end schedulePostController')
        return
      } else {
        throw e
      }
    }

    response.send().status(201)
    logger.info('end schedulePostController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end schedulePostController')
    logger.error('error:', e)
  }
}
