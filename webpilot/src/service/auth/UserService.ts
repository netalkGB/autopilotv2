import { User } from '../../entity/auth/User'

export interface UserService {
  getUserByUserId(userId: string): Promise<User | null>
}
