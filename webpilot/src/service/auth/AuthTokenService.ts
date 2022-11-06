import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'

export interface AuthTokenService {
  getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null>
  saveAuthToken(authToken: TmpAuthToken): Promise<void>
}
