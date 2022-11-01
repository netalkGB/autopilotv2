import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Schedule } from './Schedule'

@Entity({ name: 'history' })
export class History {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @Column({ name: 'schedule_id' })
    @OneToOne(() => Schedule, schedule => schedule.id)
    scheduleId: string

    @Column({ name: 'date' })
    date: Date

    @Column({ name: 'result' })
    result: string
}
