import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'tmp_code' })
export class TmpCode {
  @PrimaryColumn({ name: 'code', unique: true })
  code: string

  @Column({ name: 'client_id' })
  clientId: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'scope' })
  scope: string

  @Column({ name: 'code_challenge_method' })
  codeChallengeMethod: string

  @Column({ name: 'code_challenge' })
  codeChallenge: string

  @Column({ name: 'nonce' })
  nonce: string

  @Column({ name: 'created' })
  created: Date
}
