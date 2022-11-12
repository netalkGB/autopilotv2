import { AuthTokenService } from './AuthTokenService'
import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { TmpAuthTokenHistory } from '../../entity/auth/TmpAuthTokenHistory'

export class AuthTokenServiceImpl implements AuthTokenService {
  private tmpAuthTokenRepository: Repository<TmpAuthToken>
  private tmpAuthTokenHistoryRepository: Repository<TmpAuthTokenHistory>
  private entityManager: EntityManager
  constructor (appDataSource: DataSource) {
    this.tmpAuthTokenRepository = appDataSource.getRepository(TmpAuthToken)
    this.tmpAuthTokenHistoryRepository = appDataSource.getRepository(TmpAuthTokenHistory)
    this.entityManager = appDataSource.manager
  }

  public async getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null> {
    return await this.tmpAuthTokenRepository.createQueryBuilder().select().where('user_id = :id', { id: userId }).getOne()
  }

  public async getAuthTokenCountByUserIdDateRange (userId: string, startDate: Date, endDate: Date): Promise<number> {
    return await this.tmpAuthTokenHistoryRepository.createQueryBuilder().select()
      .where('user_id = :id', { id: userId })
      .andWhere('created between :start and :end', { start: startDate, end: endDate })
      .getCount()
  }

  public async saveAuthToken (authToken: TmpAuthToken): Promise<void> {
    await this.entityManager.save(authToken)
    const history = new TmpAuthTokenHistory()
    history.email = authToken.email
    history.userId = authToken.userId
    history.token = authToken.token
    history.expireInS = authToken.expireInS
    history.created = authToken.created
    await this.entityManager.save(history)
  }
}
