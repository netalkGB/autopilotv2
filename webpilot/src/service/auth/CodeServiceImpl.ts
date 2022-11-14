import { CodeService } from './CodeService'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { TmpCode } from '../../entity/auth/TmpCode'

export class CodeServiceImpl implements CodeService {
  private tmpCodeRepository: Repository<TmpCode>
  private entityManager: EntityManager
  constructor (appDataSource: DataSource) {
    this.tmpCodeRepository = appDataSource.getRepository(TmpCode)
    this.entityManager = appDataSource.manager
  }

  public async fetchCode (code: string): Promise<TmpCode | null> {
    return await this.entityManager.createQueryBuilder().select().where('code = :code', { code }).getOne()
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
    await this.entityManager.createQueryBuilder().delete().from(TmpCode).where('code = :code', { code }).execute()
  }
}
