import { DataSource } from 'typeorm'
import { Pilot } from '../../entity/autopilot/Pilot'
import { History } from '../../entity/autopilot/History'
import { PilotService } from './PilotService'

export class PilotServiceImpl implements PilotService {
  private appDataSource: DataSource;

  constructor (appDataSource: DataSource) {
    this.appDataSource = appDataSource
  }

  public async getPilot () {
    return await this.appDataSource.getRepository(Pilot).createQueryBuilder().select().getMany()
  }

  public async getPilotByScheduleId (scheduleId: string) {
    return await this.appDataSource.getRepository(Pilot).createQueryBuilder().select().where('schedule_id = :schedule_id', { schedule_id: scheduleId }).getOne()
  }

  public async setPilot (pilot: Pilot) {
    const dbPilot = await this.appDataSource.getRepository(Pilot).createQueryBuilder().select().where('schedule_id = :schedule_id', { schedule_id: pilot.scheduleId }).getOne()
    if (dbPilot) {
      dbPilot.updateKey = pilot.updateKey
      await this.appDataSource.manager.save(dbPilot)
    } else {
      await this.appDataSource.manager.save(pilot)
    }
  }

  public async addHistory (date: Date, result: string, scheduleId: string) {
    const history = new History()
    history.date = new Date()
    history.result = result
    history.scheduleId = scheduleId
    await this.appDataSource.manager.save(history)
  }
}
