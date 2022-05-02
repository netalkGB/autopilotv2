export class ScheduleValidator {
  public validateSchedule (schedule: string):boolean {
    return schedule === 'every30minutes' || schedule === 'every1hour'
  }

  public validateName (name: string): boolean {
    return Boolean(name)
  }

  public validateURLFormat (url: string) :boolean {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return false
      }
      if (!parsed.host) {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }
}
