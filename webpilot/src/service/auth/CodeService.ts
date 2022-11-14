import { TmpCode } from '../../entity/auth/TmpCode'

export interface CodeService {
  fetchCode (code: string): Promise<TmpCode | null>
  insertCode (code: string, clientId: string, userId: string, scope: string, codeChallengeMethod: string, codeChallenge: string, nonce: string, created: Date): Promise<void>
  deleteCode (code: string): Promise<void>
}
