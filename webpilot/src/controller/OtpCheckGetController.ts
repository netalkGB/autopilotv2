import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppUtils } from '../utils/AppUtils'

const logger = log4js.getLogger('app')

export const otpCheckGetController = async (request: Request, response: Response) => {
  logger.info('start otpCheckGetController')
  // CSRFトークン生成
  const csrfToken = AppUtils.generateUUID()
  // CSRFトークンをセッションに保存
  request.session.csrfToken = csrfToken

  if (!request.session.preLoginId) {
    response.redirect('/login')
    return
  }

  response.render('otpcheck', { data: { error: false, csrfToken } })

  logger.info('end otpCheckGetController')
}
