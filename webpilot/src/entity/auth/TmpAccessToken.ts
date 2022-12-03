export class TmpAccessToken {
  private _accessToken: string

  private _userId: string

  private _clientId: string

  private _scope: string

  private _refreshToken: string

  private _expireInS: number

  private _created: Date
  get accessToken (): string {
    return this._accessToken
  }

  set accessToken (value: string) {
    this._accessToken = value
  }

  get userId (): string {
    return this._userId
  }

  set userId (value: string) {
    this._userId = value
  }

  get clientId (): string {
    return this._clientId
  }

  set clientId (value: string) {
    this._clientId = value
  }

  get scope (): string {
    return this._scope
  }

  set scope (value: string) {
    this._scope = value
  }

  get refreshToken (): string {
    return this._refreshToken
  }

  set refreshToken (value: string) {
    this._refreshToken = value
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
      accessToken: this._accessToken,
      userId: this._userId,
      clientId: this._clientId,
      scope: this._scope,
      refreshToken: this._refreshToken,
      expireInS: this._expireInS,
      created: this._created.getTime()
    }
  }
}
