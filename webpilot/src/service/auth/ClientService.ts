import { Client } from '../../entity/auth/Client'

export interface ClientService {
  getClientByClientId(clientId: string): Promise<Client | null>
}
