import { Request, Response } from 'express'
import log4js from 'log4js'

const logger = log4js.getLogger('app')

export const loginPagePostController = async (request: Request, response: Response) => {
  logger.info('start loginPagePostController')
  // csrfトークンが違うならエラー
  if (request.body.csrfToken !== request.session.csrfToken) {
    response.send('A problem was encountered in login!').status(400).end()
    return
  }
  response.render('login', { data: { error: true } })
  logger.info('end loginPagePostController')
}
