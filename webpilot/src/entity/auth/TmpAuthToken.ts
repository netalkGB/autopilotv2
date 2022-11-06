import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'tmp_auth_token' })
export class TmpAuthToken {
  @PrimaryColumn({ name: 'email' })
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
