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
  const authTokenService = new AuthTokenServiceImpl()
  const mailService = new MailServiceImpl(logger)
  const userService = new UserServiceImpl(AppDataSource.getInstance())
  const authService = new AuthServiceImpl(logger, authTokenService, mailService)
  const user = await userService.getUserByUserId(preLoginId)

  const csrfToken = AppUtils.generateUUID()
  request.session.csrfToken = csrfToken

  if (request.body.resendmail) {
    if (user) {
      await authService.preLogin(user)
    } else {
      logger.warn('resend: user not found')
      redirectToLogin()
      return
    }
    if (request.body.to) {
      response.render('otpcheck', { data: { error: false, csrfToken, to: request.body.to } })
    } else {
      response.render('otpcheck', { data: { error: false, csrfToken } })
    }
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
      if (request.body.to) {
        response.render('otpcheck', { data: { error: true, message: 'incorrect code.', csrfToken, to: request.body.to } })
      } else {
        response.render('otpcheck', { data: { error: true, message: 'incorrect code.', csrfToken } })
      }
    } else {
      logger.warn('retry pre-login: user not found')
      redirectToLogin()
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
      if (request.body.to) {
        response.render('otpcheck', { data: { error: true, message: 'otp is expired.', csrfToken, to: request.body.to } })
      } else {
        response.render('otpcheck', { data: { error: true, message: 'otp is expired.', csrfToken } })
      }
    } else {
      redirectToLogin()
    }
    return
  }

  await sessionRegenerate(request) // セッションIDは再生成する
  request.session.userId = preLoginId

  redirectToTo()
  logger.info('end otpCheckPostController')

  function redirectToLogin () {
    if (request.body.to) {
      response.redirect(`/login?to=${AppUtils.urlDecode(request.body.to)}`)
    } else {
      response.redirect('/login')
    }
  }

  function redirectToTo () {
    if (request.body.to) {
      response.redirect(AppUtils.urlDecode(request.body.to))
    } else {
      response.redirect('/')
    }
  }
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
