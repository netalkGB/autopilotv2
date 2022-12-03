import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'

export interface AuthTokenService {
  getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null>
  getAuthTokenCount (userId: string): Promise<number>
  saveAuthToken(authToken: TmpAuthToken): Promise<void>
}
