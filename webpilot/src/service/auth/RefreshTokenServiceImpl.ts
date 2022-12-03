import { TmpRefreshToken } from '../../entity/auth/TmpRefreshToken'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { RefreshTokenService } from './RefreshTokenService'
import { AccessTokenService } from './AccessTokenService'

export class RefreshTokenServiceImpl implements RefreshTokenService {
  private refreshTokenRepository: Repository<TmpRefreshToken>
  private entityManager: EntityManager
  private accessTokenService: AccessTokenService
  constructor (appDataSource: DataSource, accessTokenService: AccessTokenService) {
    this.refreshTokenRepository = appDataSource.getRepository(TmpRefreshToken)
    this.entityManager = appDataSource.manager
    this.accessTokenService = accessTokenService
  }

  public async fetchRefreshToken (refreshToken: string): Promise<TmpRefreshToken | null> {
    return await this.refreshTokenRepository.createQueryBuilder().select().where('refresh_token = :refreshToken', { refreshToken }).getOne()
  }

  public async insertRefreshToken (refreshToken: string, clientId: string, userId: string, scope: string): Promise<void> {
    const tmpRefreshToken = new TmpRefreshToken()
    tmpRefreshToken.refreshToken = refreshToken
    tmpRefreshToken.clientId = clientId
    tmpRefreshToken.userId = userId
    tmpRefreshToken.scope = scope
    tmpRefreshToken.created = new Date()

    await this.entityManager.save(tmpRefreshToken)
  }

  public async deleteRefreshToken (refreshToken: string): Promise<void> {
    await this.entityManager.createQueryBuilder().delete().from(TmpRefreshToken).where('refresh_token = :refreshToken', { refreshToken }).execute()
  }

  public async deleteRefreshTokenByAccessToken (accessToken: string): Promise<void> {
    const tmpAccessToken = await this.accessTokenService.fetchAccessTokenByToken(accessToken)
    if (tmpAccessToken) {
      await this.entityManager.createQueryBuilder().delete().from(TmpRefreshToken).where('refresh_token = :refreshToken', { refreshToken: tmpAccessToken.refreshToken }).execute()
    }
  }
}
