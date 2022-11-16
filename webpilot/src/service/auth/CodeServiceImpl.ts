import { CodeService } from './CodeService'
import { DataSource, Repository } from 'typeorm'
import { TmpCode } from '../../entity/auth/TmpCode'

export class CodeServiceImpl implements CodeService {
  private tmpCodeRepository: Repository<TmpCode>
  constructor (appDataSource: DataSource) {
    this.tmpCodeRepository = appDataSource.getRepository(TmpCode)
  }

  public async fetchCode (code: string): Promise<TmpCode | null> {
    return await this.tmpCodeRepository.createQueryBuilder().select().where('code = :code', { code }).getOne()
  }

  public async insertCode (code: string, clientId: string, userId: string, scope: string, codeChallengeMethod: string, codeChallenge: string, nonce: string, created: Date): Promise<void> {
    const tmpCode = new TmpCode()
    tmpCode.code = code
    tmpCode.clientId = clientId
    tmpCode.userId = userId
    tmpCode.scope = scope
    tmpCode.codeChallengeMethod = codeChallengeMethod
    tmpCode.codeChallenge = codeChallenge
    tmpCode.nonce = nonce
    tmpCode.created = created
    await this.tmpCodeRepository.save(tmpCode)
  }

  public async deleteCode (code: string): Promise<void> {
    await this.tmpCodeRepository.createQueryBuilder().delete().where('code = :code', { code }).execute()
  }
}
