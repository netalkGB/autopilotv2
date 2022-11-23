import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppUtils } from '../utils/AppUtils'

const logger = log4js.getLogger('app')

export const loginReleaseGetController = async (request: Request, response: Response) => {
  logger.info('start superController')
  request.session.destroy((_err) => {
    if (request.query.to) {
      response.redirect(AppUtils.urlDecode(request.query.to as string))
      return
    }
    response.redirect('/')
  })
  logger.info('end superController')
}
