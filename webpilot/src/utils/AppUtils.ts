const { randomUUID } = require('crypto')

export class AppUtils {
  public static generateUUID (): string {
    return randomUUID()
  }
}
