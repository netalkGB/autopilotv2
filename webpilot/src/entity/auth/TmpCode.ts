export class TmpCode {
  private _code: string

  private _clientId: string

  private _userId: string

  private _scope: string

  private _codeChallengeMethod: string

  private _codeChallenge: string

  private _nonce: string

  private _created: Date

  get code (): string {
    return this._code
  }

  set code (value: string) {
    this._code = value
  }

  get clientId (): string {
    return this._clientId
  }

  set clientId (value: string) {
    this._clientId = value
  }

  get userId (): string {
    return this._userId
  }

  set userId (value: string) {
    this._userId = value
  }

  get scope (): string {
    return this._scope
  }

  set scope (value: string) {
    this._scope = value
  }

  get codeChallengeMethod (): string {
    return this._codeChallengeMethod
  }

  set codeChallengeMethod (value: string) {
    this._codeChallengeMethod = value
  }

  get codeChallenge (): string {
    return this._codeChallenge
  }

  set codeChallenge (value: string) {
    this._codeChallenge = value
  }

  get nonce (): string {
    return this._nonce
  }

  set nonce (value: string) {
    this._nonce = value
  }

  get created (): Date {
    return this._created
  }

  set created (value: Date) {
    this._created = value
  }

  public toJSON (): object {
    return {
      code: this._code,
      clientId: this._clientId,
      userId: this._userId,
      scope: this._scope,
      codeChallengeMethod: this._codeChallengeMethod,
      codeChallenge: this._codeChallenge,
      nonce: this._nonce,
      created: this._created.getTime()
    }
  }
}
