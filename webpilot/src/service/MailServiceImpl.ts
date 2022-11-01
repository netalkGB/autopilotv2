import nodemailer, { Transporter } from 'nodemailer'
import log4js from 'log4js'
import { ServerConfig } from '../ServerConfig'

export class MailServiceImpl {
  private transport: Transporter
  private logger: log4js.Logger

  constructor (logger: log4js.Logger) {
    this.logger = logger
    const nodemailerConfig = ServerConfig.mailConfig.nodemailer
    this.transport = nodemailer.createTransport(nodemailerConfig)
  }

  public async send (to: string, subject: string, text: string): Promise<boolean> {
    try {
      const from = ServerConfig.mailConfig.fromAddr
      this.logger.info(`MailService#send() from:${from}, to:${to}, subject:${subject}, text:${text}`)
      await this.transport.sendMail({
        from,
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
