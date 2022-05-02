import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'config' })
export class Config {
  @PrimaryColumn({ name: 'key' })
  key: string

  @Column({ name: 'value' })
  value: string
}
