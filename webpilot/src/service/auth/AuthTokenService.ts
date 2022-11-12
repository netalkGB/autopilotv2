import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'

export interface AuthTokenService {
  getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null>
  getAuthTokenCountByUserIdDateRange (userId: string, startDate: Date, endDate: Date): Promise<number>
  saveAuthToken(authToken: TmpAuthToken): Promise<void>
}
