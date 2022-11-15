import { UserInfo } from '../../entity/auth/UserInfo'
import { DataSource, Repository } from 'typeorm'
import { UserInfoService } from './UserInfoService'

export class UserInfoServiceImpl implements UserInfoService {
  private userInfoRepository: Repository<UserInfo>
  constructor (appDataSource: DataSource) {
    this.userInfoRepository = appDataSource.getRepository(UserInfo)
  }

  public async fetchUserInfo (userId: string): Promise<UserInfo | null> {
    return await this.userInfoRepository.createQueryBuilder().select().where('user_id = :userId', { userId }).getOne()
  }
}
