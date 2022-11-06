import randomstring from 'randomstring'
import { randomUUID, createHash } from 'crypto'

export class AppUtils {
  public static generateUUID (): string {
    return randomUUID()
  }

  public static generateLoginToken (): string {
    return this.generateRandomString(8)
  }

  public static hashOtp (otp: string): string {
    return this.hashString(otp)
  }

  public static generateRandomString (length: number): string {
    return randomstring.generate(length)
  }

  public static hashString (str: string): string {
    return createHash('sha512').update(str).digest('hex')
  }
}
