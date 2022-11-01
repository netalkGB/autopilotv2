import { Schedule } from '../entity/autopilot/Schedule'
import { History } from '../entity/autopilot/History'

export interface ScheduleService {
  getSchedule(): Promise<Schedule[]>

  getScheduleBySchedules(schedule: 'every30minutes' | 'every1hour'): Promise<Schedule[]>

  getScheduleByUrlCount(url: string): Promise<number>

  checkExistsScheduleById(id: string): Promise<boolean>

  addSchedule(schedule: Schedule): Promise<void>

  deleteSchedule(id: string): Promise<void>

  updateSchedule(id: string, schedule: string, name: string): Promise<void>

  getHistory(): Promise<History[]>
}
