import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { AppUtils } from '../utils/AppUtils'
import { MailServiceImpl } from '../service/autopilot/MailServiceImpl'
import { UserServiceImpl } from '../service/auth/UserServiceImpl'
import { AuthTokenServiceImpl } from '../service/auth/AuthTokenServiceImpl'
import { AuthServiceImpl } from '../service/auth/AuthServiceImpl'

const logger = log4js.getLogger('app')

export const loginPagePostController = async (request: Request, response: Response) => {
  logger.info('start loginPagePostController')
  // csrfトークンが違うならエラー
  if (request.body.csrfToken !== request.session.csrfToken) {
    response.send('A problem was encountered in login!').status(400).end()
    return
  }
  // CSRFトークン生成
  const csrfToken = AppUtils.generateUUID()
  // CSRFトークンをセッションに保存
  request.session.csrfToken = csrfToken

  const id = request.body.id
  logger.debug(`id: ${id}`)
  if (!id) {
    response.render('login', { data: { csrfToken, error: true, message: 'Please enter your id.', to: request.body.to } })
    return
  }
  const userService = new UserServiceImpl(AppDataSource)
  const user = await userService.getUserByUserId(id)
  logger.debug(`user: ${JSON.stringify(user)}`)
  if (user === null) {
    logger.info(`That id is not registered: ${id}`)
    response.render('login', { data: { csrfToken, error: true, message: 'That id is not registered.', to: request.body.to } })
    return
  }

  const authTokenService = new AuthTokenServiceImpl(AppDataSource)
  const mailService = new MailServiceImpl(logger)

  const authService = new AuthServiceImpl(logger, authTokenService, mailService)
  await authService.preLogin(user)
  // ユーザーIDをセッションに格納
  request.session.preLoginId = user.id

  if (request.body.to) {
    response.redirect(`/otpcheck?to=${AppUtils.urlEncode(request.body.to)}`)
  } else {
    response.redirect('/otpcheck')
  }
  logger.info('end loginPagePostController')
}
