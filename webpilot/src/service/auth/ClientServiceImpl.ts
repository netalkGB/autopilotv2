import { Client } from '../../entity/auth/Client'
import { ClientService } from './ClientService'
import { DataSource, Repository } from 'typeorm'

export class ClientServiceImpl implements ClientService {
  private clientRepository: Repository<Client>
  constructor (appDataSrouce: DataSource) {
    this.clientRepository = appDataSrouce.getRepository(Client)
  }

  public async getClientByClientId (clientId: string): Promise<Client | null> {
    return this.clientRepository.createQueryBuilder().select().where('client_id = :clientId', { clientId: clientId }).getOne()
  }
}
