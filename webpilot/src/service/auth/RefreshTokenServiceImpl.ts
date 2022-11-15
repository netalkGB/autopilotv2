import { TmpRefreshToken } from '../../entity/auth/TmpRefreshToken'
import { DataSource, EntityManager, Repository } from 'typeorm'

export class RefreshTokenService {
  private refreshTokenRepository: Repository<TmpRefreshToken>
  private entityManager: EntityManager
  constructor (appDataSource: DataSource) {
    this.refreshTokenRepository = appDataSource.getRepository(TmpRefreshToken)
    this.entityManager = appDataSource.manager
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
}
