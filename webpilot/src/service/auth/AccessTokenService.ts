export interface AccessTokenService {
  insertAccessToken(accessToken: string, userId: string, clientId: string, scope: string, refreshToken: string, expiresInS: number): Promise<void>
}
