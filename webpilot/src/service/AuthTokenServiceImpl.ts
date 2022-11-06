import { AuthTokenService } from './AuthTokenService'
import { TmpAuthToken } from '../entity/auth/TmpAuthToken'
import { DataSource, EntityManager, Repository } from 'typeorm'

export class AuthTokenServiceImpl implements AuthTokenService {
  private tmpAuthTokenRepository: Repository<TmpAuthToken>
  private entityManager: EntityManager
  constructor (appDataSource: DataSource) {
    this.tmpAuthTokenRepository = appDataSource.getRepository(TmpAuthToken)
    this.entityManager = appDataSource.manager
  }

  public async getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null> {
    return await this.tmpAuthTokenRepository.createQueryBuilder().select().where('user_id = :id', { id: userId }).getOne()
  }

  public async saveAuthToken (authToken: TmpAuthToken): Promise<void> {
    await this.entityManager.save(authToken)
  }
}
