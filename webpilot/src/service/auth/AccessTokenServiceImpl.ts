import { TmpAccessToken } from '../../entity/auth/TmpAccessToken'
import { AccessTokenService } from './AccessTokenService'
import { RedisClient } from '../../utils/RedisClient'

const REDIS_ACCESS_TOKEN_BASE_KEY = 'tmpAccessToken'
export class AccessTokenServiceImpl implements AccessTokenService {
  public async fetchAccessTokenByToken (accessToken: string): Promise<TmpAccessToken | null> {
    const client = RedisClient.create()
    await client.connect()
    try {
      let tmpAccessToken = null
      const data = await client.get(this.generateRedisKey(accessToken))
      if (data) {
        tmpAccessToken = new TmpAccessToken()
        const at = JSON.parse(data)
        tmpAccessToken.accessToken = at.accessToken
        tmpAccessToken.userId = at.userId
        tmpAccessToken.clientId = at.clientId
        tmpAccessToken.scope = at.scope
        tmpAccessToken.refreshToken = at.refreshToken
        tmpAccessToken.expireInS = at.expiresInS
        tmpAccessToken.created = new Date(at.created)
      }
      return tmpAccessToken
    } finally {
      await client.disconnect()
    }
  }

  public async insertAccessToken (accessToken: string, userId: string, clientId: string, scope: string, refreshToken: string, expiresInS: number): Promise<void> {
    const client = RedisClient.create()
    await client.connect()
    try {
      const tmpAccessToken = new TmpAccessToken()
      tmpAccessToken.accessToken = accessToken
      tmpAccessToken.userId = userId
      tmpAccessToken.clientId = clientId
      tmpAccessToken.scope = scope
      tmpAccessToken.refreshToken = refreshToken
      tmpAccessToken.expireInS = expiresInS
      tmpAccessToken.created = new Date()
      await client.setEx(this.generateRedisKey(accessToken), expiresInS, JSON.stringify(tmpAccessToken))
    } finally {
      await client.disconnect()
    }
  }

  public async deleteAccessToken (accessToken: string): Promise<void> {
    const client = RedisClient.create()
    await client.connect()
    try {
      await client.del(this.generateRedisKey(accessToken))
    } finally {
      await client.disconnect()
    }
  }

  private generateRedisKey (accessToken: string): string {
    return `${REDIS_ACCESS_TOKEN_BASE_KEY}/${accessToken}`
  }
}
