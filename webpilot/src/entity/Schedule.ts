import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    _id: string

    @Column({ name: 'url', unique: true })
    _url: string

    @Column({ name: 'name' })
    _name: string

    @Column({ name: 'schedule' })
    _schedule: string

    get id (): string {
      return this._id
    }

    get url ():string {
      return this._url
    }

    get name ():string {
      return this._name
    }

    get schedule (): string {
      return this._schedule
    }

    set url (url: string) {
      this._url = url
    }

    set name (name: string) {
      this._name = name
    }

    set schedule (schedule: string) {
      this._schedule = schedule
    }

    toJSON () {
      return {
        id: this.id,
        url: this.url,
        name: this.name,
        schedule: this.schedule
      }
    }
}
