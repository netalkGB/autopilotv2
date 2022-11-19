import { DataSource, EntityManager, Repository } from 'typeorm'
import { TmpAccessToken } from '../../entity/auth/TmpAccessToken'
import { AccessTokenService } from './AccessTokenService'

export class AccessTokenServiceImpl implements AccessTokenService {
  private entityManager: EntityManager
  private tmpAccessTokenRepository: Repository<TmpAccessToken>
  constructor (appDataSource: DataSource) {
    this.entityManager = appDataSource.manager
    this.tmpAccessTokenRepository = appDataSource.getRepository(TmpAccessToken)
  }

  public async fetchAccessTokenByToken (accessToken: string): Promise<TmpAccessToken | null> {
    return await this.tmpAccessTokenRepository.createQueryBuilder().select().where('access_token = :accessToken', { accessToken }).getOne()
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

  public async deleteAccessToken (accessToken: string): Promise<void> {
    await this.tmpAccessTokenRepository.createQueryBuilder().delete().where('access_token = :accessToken', { accessToken }).execute()
  }
}
