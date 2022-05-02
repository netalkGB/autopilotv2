import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { History } from './entity/History'
import { Pilot } from './entity/Pilot'
import { Schedule } from './entity/Schedule'
import { Config } from './entity/Config'
import dbConfig from '../dbConfig.json'

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
  entities: [Schedule, Pilot, History, Config]
})
