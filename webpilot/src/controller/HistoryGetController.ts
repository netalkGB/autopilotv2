import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import { ScheduleService } from '../service/ScheduleService'
import log4js from 'log4js'
import { HistoryResponse } from '../model/HistoryResponse'

const logger = log4js.getLogger('app')

export const historyGetController = async (request: Request, response: Response) => {
  logger.info('start historyGetController')
  const scheduleService = new ScheduleService(AppDataSource)
  try {
    const histories = await scheduleService.getHistory()

    const historyResponse = histories.map(h => {
      const historyResponse = new HistoryResponse()
      historyResponse.id = h.id
      historyResponse.scheduleId = h.scheduleId
      historyResponse.date = h.date
      historyResponse.result = h.result
      return historyResponse
    })

    response.send(historyResponse).status(200)
    logger.info('end historyGetController')
  } catch (e) {
    response.send('error').status(500)
    logger.error('!end historyGetController')
    logger.error('error:', e)
  }
}
