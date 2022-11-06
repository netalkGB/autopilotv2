import { UserService } from './UserService'
import { User } from '../entity/auth/User'
import { DataSource, Repository } from 'typeorm'

export class UserServiceImpl implements UserService {
  private userRepository: Repository<User>
  constructor (appDataSource: DataSource) {
    this.userRepository = appDataSource.getRepository(User)
  }

  public async getUserByUserId (userId: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder().select().where('id = :id', { id: userId }).getOne()
  }
}
