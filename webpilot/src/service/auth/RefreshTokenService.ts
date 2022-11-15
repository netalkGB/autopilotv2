import { TmpRefreshToken } from '../../entity/auth/TmpRefreshToken'

export interface RefreshTokenService {
  fetchRefreshToken(refreshToken: string): Promise<TmpRefreshToken | null>
  insertRefreshToken(refreshToken: string, clientId: string, userId: string, scope: string): Promise<void>
  deleteRefreshToken(refreshToken: string): Promise<void>
}
