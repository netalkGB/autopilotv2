export class DiscordConfigResponse {
  private _configured: boolean

  get configured (): boolean {
    return this._configured
  }

  set configured (value: boolean) {
    this._configured = value
  }

  toJSON () {
    return {
      configured: this.configured
    }
  }
}
