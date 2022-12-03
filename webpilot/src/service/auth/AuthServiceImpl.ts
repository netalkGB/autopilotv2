import { AuthService } from './AuthService'
import { User } from '../../entity/auth/User'
import { AppUtils } from '../../utils/AppUtils'
import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'
import { MailService } from '../autopilot/MailService'
import { AuthTokenService } from './AuthTokenService'
import log4js from 'log4js'

const EMAIL_SEND_COUNT_LIMIT = 50

export class AuthServiceImpl implements AuthService {
  private mailService: MailService
  private authTokenService: AuthTokenService
  private logger: log4js.Logger

  constructor (logger: log4js.Logger, authTokenService: AuthTokenService, mailService: MailService) {
    this.logger = logger
    this.authTokenService = authTokenService
    this.mailService = mailService
  }

  public async preLogin (user: User): Promise<void> {
    const count = await this.authTokenService.getAuthTokenCount(user.id)
    this.logger.info(`email send count: ${count}`)
    if (count > EMAIL_SEND_COUNT_LIMIT) {
      this.logger.info('email send rate limit')
      return
    }

    const token = AppUtils.generateLoginToken()
    await this.mailService.send(user.email, 'Autopilot login code verification', `Your Autopilot login code is: ${token}\nDon't share it with anyone.`)

    const authToken = new TmpAuthToken()
    authToken.email = user.email
    authToken.userId = user.id
    authToken.created = new Date()
    authToken.token = AppUtils.hashOtp(token)
    authToken.expireInS = 30
    await this.authTokenService.saveAuthToken(authToken)
  }
}
