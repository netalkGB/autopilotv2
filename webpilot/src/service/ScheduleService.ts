import { DataSource } from 'typeorm'
import { History } from '../entity/History'
import { Schedule } from '../entity/Schedule'

export class ScheduleService {
    private appDataSource: DataSource;

    constructor (appDataSource: DataSource) {
      this.appDataSource = appDataSource
    }

    public async getSchedule () {
      return await this.appDataSource.getRepository(Schedule).createQueryBuilder().select().getMany()
    }

    public async getScheduleBySchedules (schedule: 'every30minutes' | 'every1hour') {
      return await this.appDataSource.getRepository(Schedule).createQueryBuilder().select().where('schedule = :schedule', { schedule }).getMany()
    }

    public async getScheduleByUrlCount (url :string) {
      return await this.appDataSource.getRepository(Schedule).createQueryBuilder().select().where('url = :url', { url }).getCount()
    }

    public async checkExistsScheduleById (id :string) {
      return await this.appDataSource.getRepository(Schedule).createQueryBuilder().select().where('id = :id', { id }).getCount() > 0
    }

    public async addSchedule (schedule: Schedule) {
      const scheduleCount = await this.getScheduleByUrlCount(schedule.url)
      if (scheduleCount > 0) {
        throw new Error('already registered')
      }
      await this.appDataSource.manager.save(schedule)
    }

    public async deleteSchedule (id: string) {
      await this.appDataSource.createQueryBuilder().delete().from(Schedule).where('id = :id', { id }).execute()
    }

    public async updateSchedule (id: string, schedule: string, name: string) {
      const isAlreadyExist = await this.checkExistsScheduleById(id)
      if (!isAlreadyExist) {
        throw new Error('not yet registered')
      }

      let updateColumn = {}
      if (schedule) {
        updateColumn = {
          ...updateColumn,
          _schedule: schedule
        }
        if (name) {
          updateColumn = {
            ...updateColumn,
            _name: name
          }
        }
      }
      await this.appDataSource.createQueryBuilder().update(Schedule).set(updateColumn).where('id = :id', { id }).execute()
    }

    public async getHistory () {
      return await this.appDataSource.getRepository(History).createQueryBuilder().select().getMany()
    }
}
