import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { History } from './entity/autopilot/History'
import { Pilot } from './entity/autopilot/Pilot'
import { Schedule } from './entity/autopilot/Schedule'
import { Config } from './entity/autopilot/Config'
import dbConfig from '../dbConfig.json'
import { Client } from './entity/auth/Client'
import { TmpRefreshToken } from './entity/auth/TmpRefreshToken'
import { User } from './entity/auth/User'
import { UserInfo } from './entity/auth/UserInfo'

const {
  host,
  port,
  username,
  password,
  database
} = dbConfig.rdb

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
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
