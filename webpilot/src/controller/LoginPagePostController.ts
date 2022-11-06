import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { User } from '../entity/auth/User'
import { AppUtils } from '../utils/AppUtils'
import { MailServiceImpl } from '../service/MailServiceImpl'
import { TmpAuthToken } from '../entity/auth/TmpAuthToken'

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
    response.render('login', { data: { csrfToken, error: true, message: 'Please enter your id.' } })
    return
  }
  // TODO: あとでサービスにする
  const userRepository = AppDataSource.getRepository(User)
  // const tmpAuthTokenRepository = AppDataSource.getRepository(TmpAuthToken)
  const user = await userRepository.createQueryBuilder().select().where('id = :id', { id }).getOne()
  logger.debug(`user: ${JSON.stringify(user)}`)
  if (user === null) {
    logger.info(`That id is not registered: ${id}`)
    response.render('login', { data: { csrfToken, error: true, message: 'That id is not registered.' } })
    return
  }
  const token = AppUtils.generateLoginToken()

  const authToken = new TmpAuthToken()
  const mailService = new MailServiceImpl(logger)
  await mailService.send(user.email, 'autopilot authentication', `login code is ${token}`)

  authToken.email = user.email
  authToken.userId = id
  authToken.created = new Date()
  authToken.token = token
  authToken.expireInS = 30

  await AppDataSource.manager.save(authToken)
  // ユーザーIDをセッションに格納
  request.session.preLoginId = user.id

  response.redirect('/otpcheck')
  logger.info('end loginPagePostController')
}
