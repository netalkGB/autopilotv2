import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppUtils } from '../utils/AppUtils'

const logger = log4js.getLogger('app')

export const loginPageGetController = async (request: Request, response: Response) => {
  logger.info('start loginPageGetController')
  // CSRFトークン生成
  const csrfToken = AppUtils.generateUUID()
  // CSRFトークンをセッションに保存
  request.session.csrfToken = csrfToken

  if (request.query.to) {
    response.render('login', { data: { error: false, csrfToken, to: request.query.to } })
  } else {
    response.render('login', { data: { error: false, csrfToken } })
  }
  logger.info('end indexPageGetController')
}
