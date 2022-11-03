import randomstring from 'randomstring'
import { randomUUID } from 'crypto'

export class AppUtils {
  public static generateUUID (): string {
    return randomUUID()
  }

  public static generateLoginToken (): string {
    return this.generateRandomString(8)
  }

  public static generateRandomString (length: number): string {
    return randomstring.generate(length)
  }
}
