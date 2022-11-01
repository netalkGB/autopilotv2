import { ScheduleService } from './ScheduleService'
import { PilotService } from './PilotService'
import log4js from 'log4js'
import { RSSService } from './RSSService'
import { Pilot } from '../entity/autopilot/Pilot'
import { NotificationService } from './NotificationService'
import { AutoPilotService } from './AutoPilotService'

export class AutoPilotServiceImpl implements AutoPilotService {
  private logger: log4js.Logger
  private scheduleService: ScheduleService
  private pilotService: PilotService
  private rssService: RSSService
  private notificationService: NotificationService

  constructor (logger: log4js.Logger, scheduleService: ScheduleService, pilotService: PilotService, rssService: RSSService, notificationService: NotificationService) {
    this.logger = logger
    this.scheduleService = scheduleService
    this.pilotService = pilotService
    this.rssService = rssService
    this.notificationService = notificationService
  }

  public async pilot (schedule: 'every30minutes' | 'every1hour') {
    const schedules = await this.scheduleService.getScheduleBySchedules(schedule)
    for (const s of schedules) {
      const date = new Date()
      const url = s.url
      const scheduleId = s.id
      try {
        const updateKeyFromServer = await this.rssService.getLatestPostUrl(url)
        const pilotFromDB = await this.pilotService.getPilotByScheduleId(scheduleId)

        if (!pilotFromDB) {
          this.logger.info(`AutoPilotService#pilot() first pilot ${s.id}, ${s.url}, ${s.schedule}, ${s.name}`)
        } else {
          this.logger.info(`AutoPilotService#pilot() pilot ${s.id}, ${s.url}, ${s.schedule}, ${s.name}`)
          const updateKeyFromPrevPilot = pilotFromDB.updateKey
          if (updateKeyFromServer !== updateKeyFromPrevPilot) {
            this.logger.info(`AutoPilotService#pilot() DETECT!!!! ${s.id}, ${s.url}, ${s.schedule}, ${s.name}`)
            await this.notificationService.notify(`更新検出 name: ${s.name}, url: ${updateKeyFromServer}`)
          }
          this.logger.info(`AutoPilotService#pilot() ${s.id}, ${s.url}, ${s.schedule}, ${s.name}`)
        }
        const newPilot = new Pilot()
        newPilot.updateKey = updateKeyFromServer
        newPilot.scheduleId = scheduleId
        await this.pilotService.setPilot(newPilot)
        await this.pilotService.addHistory(date, 'success', scheduleId)
      } catch (e) {
        this.logger.error(`AutoPilotService#pilot() ${s.id}, ${s.url}, ${s.schedule}, ${s.name}, error`, e)
        await this.pilotService.addHistory(date, 'failed', scheduleId)
      }
    }
  }
}
