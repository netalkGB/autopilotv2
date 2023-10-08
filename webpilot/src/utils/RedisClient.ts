import { createClient, RedisClientType } from 'redis'
import { DatabaseConfig } from '../DatabaseConfig'

export class RedisClient {
  public static create (): RedisClientType {
    const redisConfig = DatabaseConfig.redis
    const username = redisConfig?.username
    const password = redisConfig?.password
    const host = redisConfig?.host
    const port = redisConfig?.port

    return createClient({
      url: `redis://${username ? `${username}:${password}@` : ''}${host}:${port}`
    })
  }
}
