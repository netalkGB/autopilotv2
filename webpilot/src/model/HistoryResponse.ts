export class HistoryResponse {
  private _id: string

  private _scheduleId: string

  private _date: Date

  private _result: string

  get id (): string {
    return this._id
  }

  set id (value: string) {
    this._id = value
  }

  get scheduleId (): string {
    return this._scheduleId
  }

  set scheduleId (value: string) {
    this._scheduleId = value
  }

  get date (): Date {
    return this._date
  }

  set date (value: Date) {
    this._date = value
  }

  get result (): string {
    return this._result
  }

  set result (value: string) {
    this._result = value
  }

  toJSON () {
    return {
      id: this.id,
      scheduleId: this.id,
      date: this.date,
      result: this.result
    }
  }
}
