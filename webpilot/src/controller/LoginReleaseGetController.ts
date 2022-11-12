import { Request, Response } from 'express'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const loginReleseGetController = async (request: Request, response: Response) => {
  logger.info('start superController')
  request.session.destroy((_err) => {
    response.redirect('/')
  })
  logger.info('end superController')
}
