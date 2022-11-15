import { DataSource, EntityManager } from 'typeorm'
import { TmpAccessToken } from '../../entity/auth/TmpAccessToken'
import { AccessTokenService } from './AccessTokenService'

export class AccessTokenServiceImpl implements AccessTokenService {
  private entityManager: EntityManager
  constructor (appDataSource: DataSource) {
    this.entityManager = appDataSource.manager
  }

  public async insertAccessToken (accessToken: string, userId: string, clientId: string, scope: string, refreshToken: string, expiresInS: number): Promise<void> {
    const tmpAccessToken = new TmpAccessToken()
    tmpAccessToken.accessToken = accessToken
    tmpAccessToken.userId = userId
    tmpAccessToken.clientId = clientId
    tmpAccessToken.scope = scope
    tmpAccessToken.refreshToken = refreshToken
    tmpAccessToken.expireInS = expiresInS
    tmpAccessToken.created = new Date()

    await this.entityManager.save(tmpAccessToken)
  }
}
