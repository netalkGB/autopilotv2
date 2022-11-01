import { Column, Entity } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @Column({ name: 'id', unique: true })
  id: string

  @Column({ name: 'email', unique: true })
  email: string

  @Column({ name: 'verified' })
  verified: boolean

  @Column({ name: 'created' })
  created: Date
}
