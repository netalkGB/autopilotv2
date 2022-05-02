import { ConfigService } from './ConfigService'
import fetch from 'node-fetch'

export class NotificationService {
  private DISCORD_CONFIG_KEY = 'discordWebHookUrl';

  private configService: ConfigService
  constructor (configService: ConfigService) {
    this.configService = configService
  }

  public async notify (message: string) {
    await this.discordPost(message)
  }

  private async discordPost (message:string) {
    const webhookUrl = await this.configService.getConfigValue(this.DISCORD_CONFIG_KEY)
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'post',
        body: JSON.stringify({
          content: message
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
}
