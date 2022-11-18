import { TmpAccessToken } from '../../entity/auth/TmpAccessToken'

export interface AccessTokenService {
  insertAccessToken(accessToken: string, userId: string, clientId: string, scope: string, refreshToken: string, expiresInS: number): Promise<void>
  fetchAccessTokenByToken(accessToken: string): Promise<TmpAccessToken | null>
}
