export interface MailService {
  send(to: string, subject: string, text: string): Promise<boolean>
}
