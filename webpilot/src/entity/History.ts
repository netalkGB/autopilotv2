import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Schedule } from './Schedule'

@Entity({ name: 'history' })
export class History {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    _id: string

    @Column({ name: 'schedule_id' })
    @OneToOne(() => Schedule, schedule => schedule.id)
    _scheduleId: string

    @Column({ name: 'date' })
    _date: Date

    @Column({ name: 'result' })
    _result: string

    get id (): string {
      return this._id
    }

    get scheduleId (): string {
      return this._scheduleId
    }

    get date (): Date {
      return this._date
    }

    get result ():string {
      return this._result
    }

    set scheduleId (scheduleId: string) {
      this._scheduleId = scheduleId
    }

    set date (date: Date) {
      this._date = date
    }

    set result (result: string) {
      this._result = result
    }

    toJSON () {
      return {
        id: this.id,
        scheduleId: this.scheduleId,
        date: this.date,
        result: this.result
      }
    }
}
