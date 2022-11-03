import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ name: 'id', unique: true })
  id: string

  @PrimaryColumn({ name: 'email', unique: true })
  email: string

  @Column({ name: 'verified' })
  verified: boolean

  @Column({ name: 'created' })
  created: Date
}
