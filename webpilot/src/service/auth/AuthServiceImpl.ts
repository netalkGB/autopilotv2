import { AuthService } from './AuthService'
import { User } from '../../entity/auth/User'
import { AppUtils } from '../../utils/AppUtils'
import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'
import { MailService } from '../autopilot/MailService'
import { AuthTokenService } from './AuthTokenService'
import log4js from 'log4js'

const EMAIL_SEND_COUNT_LIMIT = 50
const EMAIL_SEND_COUNT_LIMIT_DENOMINATOR_HOUR = 24

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
    const end = new Date()
    const start = new Date(end.getTime())
    start.setHours(end.getHours() - EMAIL_SEND_COUNT_LIMIT_DENOMINATOR_HOUR)

    const count = await this.authTokenService.getAuthTokenCountByUserIdDateRange(user.id, start, end)
    this.logger.info(`email send count: ${count}`)
    if (count > EMAIL_SEND_COUNT_LIMIT) {
      this.logger.info('email send rate limit')
      return
    }

    const token = AppUtils.generateLoginToken()
    await this.mailService.send(user.email, 'autopilot authentication', `login code is ${token}`)

    const authToken = new TmpAuthToken()
    authToken.email = user.email
    authToken.userId = user.id
    authToken.created = new Date()
    authToken.token = AppUtils.hashOtp(token)
    authToken.expireInS = 30
    await this.authTokenService.saveAuthToken(authToken)
  }
}
