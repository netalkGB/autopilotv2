import { Request, Response } from 'express'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const indexPageGetController = async (request: Request, response: Response) => {
  logger.info('start indexPageGetController')
  if (!request.session?.username) {
    logger.debug('redirect to /login')
    response.redirect('/login')
    logger.info('end indexPageGetController')
    return
  }

  response.render('index', { data: { username: request.session.username } })
  logger.info('end indexPageGetController')
}
