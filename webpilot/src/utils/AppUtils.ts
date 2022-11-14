import randomstring from 'randomstring'
import crypto, { randomUUID, createHash } from 'crypto'

export class AppUtils {
  public static generateUUID (): string {
    return randomUUID()
  }

  public static generateLoginToken (): string {
    return this.generateRandomString(8)
  }

  public static generateApproveCode (): string {
    return this.generateRandomString(8)
  }

  public static hashOtp (otp: string): string {
    return this.hashString(otp)
  }

  public static base64Decode (base64Str: string): string {
    return Buffer.from(base64Str, 'base64').toString()
  }


  public static urlEncode (str: string): string {
    return encodeURIComponent(str)
  }

  public static urlDecode (str: string): string {
    return decodeURIComponent(str)
  }

  public static generateRandomString (length: number): string {
    return randomstring.generate(length)
  }

  public static hashString (str: string): string {
    return createHash('sha512').update(str).digest('hex')
  }
}
