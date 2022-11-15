import { UserInfo } from '../../entity/auth/UserInfo'

export interface UserInfoService {
  fetchUserInfo(userId: string): Promise<UserInfo | null>
}
