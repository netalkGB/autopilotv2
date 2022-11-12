import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { AppUtils } from '../utils/AppUtils'
import { AuthTokenServiceImpl } from '../service/auth/AuthTokenServiceImpl'
import { MailServiceImpl } from '../service/autopilot/MailServiceImpl'
import { AuthServiceImpl } from '../service/auth/AuthServiceImpl'
import { UserServiceImpl } from '../service/auth/UserServiceImpl'

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
  const mailService = new MailServiceImpl(logger)
  const userService = new UserServiceImpl(AppDataSource)
  const authService = new AuthServiceImpl(authTokenService, mailService)
  const user = await userService.getUserByUserId(preLoginId)

  const csrfToken = AppUtils.generateUUID()
  request.session.csrfToken = csrfToken

  if (request.body.resendmail) {
    if (user) {
      await authService.preLogin(user)
    } else {
      logger.warn('resend: user not found')
      response.redirect('/login')
    }
    response.render('otpcheck', { data: { error: false, csrfToken } })
    return
  }

  const authToken = await authTokenService.getAuthTokenByUserId(preLoginId)
  if (!authToken) {
    response.send('error')
    logger.warn('authToken is not found')
    return
  }

  if (authToken.token !== AppUtils.hashOtp(request.body.otp)) {
    logger.info('otp is unmatched. ')
    if (user) {
      logger.info('retry pre-login')
      await authService.preLogin(user)
      response.render('otpcheck', { data: { error: true, message: 'otp is incorrect.', csrfToken } })
    } else {
      logger.warn('retry pre-login: user not found')
      response.redirect('/login')
    }
    return
  }

  const nowDate = new Date().getTime()
  const dateLimit = authToken.created.getTime() + (authToken.expireInS * 1000)

  if (nowDate > dateLimit) {
    logger.info('otp is expired. ')
    if (user) {
      logger.info('retry pre-login')
      await authService.preLogin(user)
      response.render('otpcheck', { data: { error: true, message: 'otp is expired.', csrfToken } })
    } else {
      response.redirect('/login')
    }
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
