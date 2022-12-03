import { AuthTokenService } from './AuthTokenService'
import { TmpAuthToken } from '../../entity/auth/TmpAuthToken'
import { RedisClient } from '../../utils/RedisClient'

const REDIS_AUTH_TOKEN_BASE_KEY = 'tmpAuthToken'
const REDIS_AUTH_TOKEN_COUNT_BASE_KEY = 'tmpAuthTokenCount'

const EMAIL_SEND_COUNT_LIMIT_DENOMINATOR_HOUR = 24
export class AuthTokenServiceImpl implements AuthTokenService {
  public async getAuthTokenByUserId (userId: string): Promise<TmpAuthToken | null> {
    const client = RedisClient.create()
    await client.connect()

    try {
      let tmpAuthToken = null
      const data = await client.get(this.generateAuthTokenRedisKey(userId))
      if (data) {
        const at = JSON.parse(data)
        tmpAuthToken = new TmpAuthToken()
        tmpAuthToken.email = at.email
        tmpAuthToken.userId = at.userId
        tmpAuthToken.token = at.token
        tmpAuthToken.expireInS = at.expireInS
        tmpAuthToken.created = new Date(at.created * 1000)
      }
      return tmpAuthToken
    } finally {
      await client.disconnect()
    }
  }

  public async getAuthTokenCount (userId: string): Promise<number> {
    const client = RedisClient.create()
    await client.connect()
    try {
      const result = await client.get(this.generateAuthTokenCountRedisKey(userId))
      if (!result) {
        return 0
      }
      return parseInt(result, 10)
    } finally {
      await client.disconnect()
    }
  }

  public async saveAuthToken (authToken: TmpAuthToken): Promise<void> {
    const client = RedisClient.create()
    try {
      await client.connect()
      // authTokenのexpireはみない きれてることを知らせたいので消したらまずい
      const expire = 60 * 30 // sessionが切れる時間とそろえた
      // TODO: expireの時間はセッションとそろえるからセッションのmax時間を設定ファイル化と共通化する
      await client.setEx(this.generateAuthTokenRedisKey(authToken.userId), expire, JSON.stringify(authToken))

      const count = await client.get(this.generateAuthTokenCountRedisKey(authToken.userId))
      if (!count) {
        await client.setEx(this.generateAuthTokenCountRedisKey(authToken.userId), EMAIL_SEND_COUNT_LIMIT_DENOMINATOR_HOUR * 60 * 60, '1')
      } else {
        await client.set(this.generateAuthTokenCountRedisKey(authToken.userId), parseInt(count, 10))
      }
    } finally {
      await client.disconnect()
    }
  }

  private generateAuthTokenRedisKey (userId: string): string {
    return `${REDIS_AUTH_TOKEN_BASE_KEY}/${userId}`
  }

  private generateAuthTokenCountRedisKey (userId: string): string {
    return `${REDIS_AUTH_TOKEN_COUNT_BASE_KEY}/${userId}`
  }
}
