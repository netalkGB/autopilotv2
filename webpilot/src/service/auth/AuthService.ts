import { User } from '../../entity/auth/User'

export interface AuthService {
  preLogin(user: User): Promise<void>
}
