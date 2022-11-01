import { Column, Entity } from 'typeorm'

@Entity({ name: 'tmp_auth_token' })
export class TmpAuthToken {
  @Column({ name: 'email' })
  email: string

  @Column({ name: 'token' })
  token: string

  @Column({ name: 'expire_in_s' })
  expireInS: number

  @Column({ name: 'created' })
  created: Date
}
