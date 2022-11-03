import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'tmp_refresh_token' })
export class TmpRefreshToken {
  @PrimaryColumn({ name: 'refresh_token', unique: true })
  refreshToken: string

  @Column({ name: 'client_id' })
  clientId: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'scope' })
  scope: string

  @Column({ name: 'created' })
  created: Date
}
