export class ScheduleResponse {
  private _id: string

  private _url: string

  private _name: string

  private _schedule: string

  get id (): string {
    return this._id
  }

  set id (value: string) {
    this._id = value
  }

  get url (): string {
    return this._url
  }

  set url (value: string) {
    this._url = value
  }

  get name (): string {
    return this._name
  }

  set name (value: string) {
    this._name = value
  }

  get schedule (): string {
    return this._schedule
  }

  set schedule (value: string) {
    this._schedule = value
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
