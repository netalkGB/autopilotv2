import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { History } from './entity/autopilot/History'
import { Pilot } from './entity/autopilot/Pilot'
import { Schedule } from './entity/autopilot/Schedule'
import { Config } from './entity/autopilot/Config'
import dbConfig from '../dbConfig.json'
import { Client } from './entity/auth/Client'
import { TmpAccessToken } from './entity/auth/TmpAccessToken'
import { TmpAuthToken } from './entity/auth/TmpAuthToken'
import { TmpCode } from './entity/auth/TmpCode'
import { TmpLoginToken } from './entity/auth/TmpLoginToken'
import { TmpRefreshToken } from './entity/auth/TmpRefreshToken'
import { User } from './entity/auth/User'
import { UserInfo } from './entity/auth/UserInfo'

const {
  host,
  port,
  username,
  password,
  database
} = dbConfig

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
    TmpAccessToken,
    TmpAuthToken,
    TmpCode,
    TmpLoginToken,
    TmpRefreshToken,
    User,
    UserInfo
  ]
})
