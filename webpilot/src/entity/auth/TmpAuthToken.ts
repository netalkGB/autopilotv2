export class TmpAuthToken {
  private _email: string

  private _userId: string

  private _token: string

  private _expireInS: number

  private _created: Date

  get email (): string {
    return this._email
  }

  set email (value: string) {
    this._email = value
  }

  get userId (): string {
    return this._userId
  }

  set userId (value: string) {
    this._userId = value
  }

  get token (): string {
    return this._token
  }

  set token (value: string) {
    this._token = value
  }

  get expireInS (): number {
    return this._expireInS
  }

  set expireInS (value: number) {
    this._expireInS = value
  }

  get created (): Date {
    return this._created
  }

  set created (value: Date) {
    this._created = value
  }

  public toJSON (): object {
    return {
      email: this._email,
      userId: this._userId,
      token: this._token,
      expireInS: this._expireInS,
      created: this._created.getTime()
    }
  }
}
