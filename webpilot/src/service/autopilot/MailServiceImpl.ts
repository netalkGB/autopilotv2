import nodemailer, { Transporter } from 'nodemailer'
import log4js from 'log4js'
import { ServerConfig } from '../../ServerConfig'
import { MailService } from './MailService'

export class MailServiceImpl implements MailService {
  private transport: Transporter
  private logger: log4js.Logger

  constructor (logger: log4js.Logger) {
    this.logger = logger
    const nodemailerConfig = ServerConfig.mailConfig.nodemailer
    this.transport = nodemailer.createTransport(nodemailerConfig)
  }

  public async send (to: string, subject: string, text: string): Promise<boolean> {
    try {
      const address = ServerConfig.mailConfig.fromAddr
      const name = ServerConfig.mailConfig.fromName
      this.logger.info(`MailService#send() address:${address}, name:${name}, to:${to}, subject:${subject}, text:${text}`)
      await this.transport.sendMail({
        from: {
          name,
          address
        },
        to,
        subject,
        text
      })
    } catch (err) {
      this.logger.warn(`fail to send email ${JSON.stringify(err)}`)
      return false
    }
    return true
  }
}
