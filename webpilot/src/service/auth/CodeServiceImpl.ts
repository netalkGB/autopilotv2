import { CodeService } from './CodeService'
import { TmpCode } from '../../entity/auth/TmpCode'
import { RedisClient } from '../../utils/RedisClient'

const REDIS_CODE_BASE_KEY = 'tmpCode'
export class CodeServiceImpl implements CodeService {
  public async fetchCode (code: string): Promise<TmpCode | null> {
    const client = RedisClient.create()
    await client.connect()
    try {
      let retCodeObj = null
      const data = await client.get(this.generateRedisKey(code))
      if (data) {
        const cd = JSON.parse(data)
        retCodeObj = new TmpCode()
        retCodeObj.code = cd.code
        retCodeObj.clientId = cd.clientId
        retCodeObj.userId = cd.userId
        retCodeObj.scope = cd.scope
        retCodeObj.codeChallengeMethod = cd.codeChallengeMethod
        retCodeObj.codeChallenge = cd.codeChallenge
        retCodeObj.nonce = cd.nonce
        retCodeObj.created = new Date(cd.created)
      }
      return retCodeObj
    } finally {
      await client.disconnect()
    }
  }

  public async insertCode (code: string, clientId: string, userId: string, scope: string, codeChallengeMethod: string, codeChallenge: string, nonce: string, created: Date): Promise<void> {
    const client = RedisClient.create()
    await client.connect()
    try {
      const tmpCode = new TmpCode()
      tmpCode.code = code
      tmpCode.clientId = clientId
      tmpCode.userId = userId
      tmpCode.scope = scope
      tmpCode.codeChallengeMethod = codeChallengeMethod
      tmpCode.codeChallenge = codeChallenge
      tmpCode.nonce = nonce
      tmpCode.created = created
      await client.setEx(this.generateRedisKey(code), 60 * 10, JSON.stringify(tmpCode))
    } finally {
      await client.disconnect()
    }
  }

  public async deleteCode (code: string): Promise<void> {
    const client = RedisClient.create()
    await client.connect()
    try {
      await client.del(this.generateRedisKey(code))
    } finally {
      await client.disconnect()
    }
  }

  private generateRedisKey (code: string): string {
    return `${REDIS_CODE_BASE_KEY}/${code}`
  }
}
