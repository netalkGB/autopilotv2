import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'pilot' })
export class Pilot {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @PrimaryColumn({ name: 'schedule_id' })
    scheduleId: string

    @Column({ name: 'update_key' })
    updateKey: string
}
