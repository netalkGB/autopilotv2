import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { AppUtils } from '../utils/AppUtils'
import { AuthTokenServiceImpl } from '../service/AuthTokenServiceImpl'

const logger = log4js.getLogger('app')

export const otpCheckPostController = async (request: Request, response: Response) => {
  logger.info('start otpCheckPostController')
  const preLoginId = request.session.preLoginId
  if (!preLoginId) {
    response.redirect('login')
    logger.info('end otpCheckController')
    return
  }
  const authTokenService = new AuthTokenServiceImpl(AppDataSource)
  const authToken = await authTokenService.getAuthTokenByUserId(preLoginId)
  if (!authToken) {
    response.send('error')
    logger.warn('authToken is not found')
    return
  }
  const csrfToken = AppUtils.generateUUID()
  request.session.csrfToken = csrfToken
  if (authToken.token !== request.body.otp) {
    logger.info('otp is unmatched. ')
    response.render('otpcheck', { data: { error: true, csrfToken } })
    return
  }

  const nowDate = new Date().getTime()
  const dateLimit = authToken.created.getTime() + (authToken.expireInS * 1000)

  if (nowDate > dateLimit) {
    logger.info('otp is expired. ')
    response.redirect('/login?error=expired')
    return
  }

  await sessionRegenerate(request) // セッションIDは再生成する
  request.session.userId = preLoginId

  response.redirect('/') // TODO: toに遷移できるべき
  logger.info('end otpCheckPostController')
}

function sessionRegenerate (request: Request) {
  return new Promise((resolve, reject) => {
    request.session.regenerate((err: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(0)
      }
    })
  })
}
