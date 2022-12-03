import { createClient, RedisClientType } from 'redis'
import dbConfig from '../../dbConfig.json'

export class RedisClient {
  public static create (): RedisClientType {
    const { username, password, host, port } = dbConfig.redis
    return createClient({
      url: `redis://${username ? `${username}:${password}@` : ''}${host}:${port}`
    })
  }
}
