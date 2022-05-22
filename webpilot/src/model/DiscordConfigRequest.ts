export class DiscordConfigRequest {
  private _discordWebHookUrl: string

  get discordWebHookUrl (): string {
    return this._discordWebHookUrl
  }

  set discordWebHookUrl (value: string) {
    this._discordWebHookUrl = value
  }

  constructor (body: any) {
    this.discordWebHookUrl = body.discordWebHookUrl
  }
}
