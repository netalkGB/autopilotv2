import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { History } from './entity/autopilot/History'
import { Pilot } from './entity/autopilot/Pilot'
import { Schedule } from './entity/autopilot/Schedule'
import { Config } from './entity/autopilot/Config'

import { Client } from './entity/auth/Client'
import { TmpRefreshToken } from './entity/auth/TmpRefreshToken'
import { User } from './entity/auth/User'
import { UserInfo } from './entity/auth/UserInfo'
import { DatabaseConfig } from './DatabaseConfig'

const createAppDataSource = () => new DataSource({
  type: 'postgres',
  host: DatabaseConfig.rdb?.host,
  port: DatabaseConfig.rdb?.port,
  username: DatabaseConfig.rdb?.username,
  password: DatabaseConfig.rdb?.password,
  database: DatabaseConfig.rdb?.database,
  synchronize: true,
  logging: true,
  entities: [
    Schedule,
    Pilot,
    History,
    Config,
    Client,
    TmpRefreshToken,
    User,
    UserInfo
  ]
})

// シングルトンでDataSourceを返す
export class AppDataSource {
  private static appDataSource: DataSource

  // eslint-disable-next-line no-useless-constructor
  private constructor () { }

  public static getInstance (): DataSource {
    if (!this.appDataSource) {
      this.appDataSource = createAppDataSource()
    }
    return this.appDataSource
  }
}
