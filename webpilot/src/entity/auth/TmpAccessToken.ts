import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'tmp_access_token' })
export class TmpAccessToken {
  @PrimaryColumn({ name: 'access_token', unique: true })
  accessToken: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'client_id' })
  clientId: string

  @Column({ name: 'scope' })
  scope: string

  @Column({ name: 'refresh_token' })
  refreshToken: string

  @Column({ name: 'expire_in_s' })
  expireInS: number

  @Column({ name: 'created' })
  created: Date
}
