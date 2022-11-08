import { AuthService } from './AuthService'
import { User } from '../../entity/auth/User'
import { AppUtils } from '../../utils/AppUtils'
import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'
import { MailService } from '../autopilot/MailService'
import { AuthTokenService } from './AuthTokenService'

export class AuthServiceImpl implements AuthService {
  private mailService: MailService
  private authTokenService: AuthTokenService

  constructor (authTokenService: AuthTokenService, mailService: MailService) {
    this.authTokenService = authTokenService
    this.mailService = mailService
  }

  public async preLogin (user: User): Promise<void> {
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
