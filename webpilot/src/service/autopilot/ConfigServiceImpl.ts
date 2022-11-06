import { DataSource } from 'typeorm'
import { Config } from '../../entity/autopilot/Config'

export class ConfigServiceImpl {
  private appDataSource: DataSource

  constructor (appDataSource: DataSource) {
    this.appDataSource = appDataSource
  }

  public async getConfigValue (key: string) {
    return (await this.appDataSource.getRepository(Config).findOneBy({ key }))?.value
  }

  public async setConfig (key: string, value: string) {
    const config = new Config()
    config.key = key
    config.value = value
    await this.appDataSource.getRepository(Config).save(config)
  }
}
