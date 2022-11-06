import { Pilot } from '../../entity/autopilot/Pilot'

export interface PilotService {
  getPilot(): Promise<Pilot[]>

  getPilotByScheduleId(scheduleId: string): Promise<Pilot | null>

  setPilot(pilot: Pilot): Promise<void>

  addHistory(date: Date, result: string, scheduleId: string): Promise<void>
}
