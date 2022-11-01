import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @Column({ name: 'url', unique: true })
    url: string

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'schedule' })
    schedule: string
}
