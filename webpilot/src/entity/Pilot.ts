import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'pilot' })
export class Pilot {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    _id: string

    @PrimaryColumn({ name: 'schedule_id' })
    _scheduleId: string

    @Column({ name: 'update_key' })
    _updateKey: string

    get id (): string {
      return this._id
    }

    get scheduleId () :string {
      return this._scheduleId
    }

    get updateKey () : string {
      return this._updateKey
    }

    set scheduleId (scheduleId: string) {
      this._scheduleId = scheduleId
    }

    set updateKey (updateKey: string) {
      this._updateKey = updateKey
    }

    toJSON () {
      return {
        id: this.id,
        scheduleId: this.scheduleId,
        updateKey: this.updateKey
      }
    }
}
