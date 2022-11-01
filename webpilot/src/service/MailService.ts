export interface MailService {
  send(from: string, to: string, subject: string, text: string): Promise<boolean>
}
