import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'client' })
export class Client {
  @PrimaryColumn({ name: 'client_id', unique: true })
  clientId: string

  @Column({ name: 'client_secret' })
  clientSecret: string

  @Column({ name: 'redirect_uri' })
  redirectUri: string

  @Column({ name: 'scope' })
  scope: string

  @Column({ name: 'is_public' })
  isPublic: boolean

  @Column({ name: 'created' })
  created: Date
}
