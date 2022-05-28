export interface AutoPilotService {
  pilot(schedule: 'every30minutes' | 'every1hour'): Promise<void>
}
