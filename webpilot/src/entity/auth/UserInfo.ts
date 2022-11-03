import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'user_info' })
export class UserInfo {
  @PrimaryColumn({ name: 'user_id', unique: true })
  userId: string

  @Column({ name: 'sub' })
  sub: string

  @Column({ name: 'preferred_username' })
  preferredUsername: string

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'email' })
  email: string

  @Column({ name: 'email_verified' })
  emailVerified: string

  @Column({ name: 'created' })
  created: Date
}
