import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tmp_auth_token_history' })
export class TmpAuthTokenHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column({ name: 'email' })
  email: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'token' })
  token: string

  @Column({ name: 'expire_in_s' })
  expireInS: number

  @Column({ name: 'created' })
  created: Date
}
