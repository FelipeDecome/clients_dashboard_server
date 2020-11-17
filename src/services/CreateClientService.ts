import { getManager, getRepository } from 'typeorm';
import findCep from 'cep-promise';

import Address from '../models/Address';
import Client from '../models/Client';

interface AddressRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city?: string;
  state?: string;
}

interface Request {
  name: string;
  addresses: AddressRequest[];
}

class CreateClientService {
  public async execute({ name, addresses }: Request): Promise<Client> {
    const clientRepository = getRepository(Client);
    const addressRepository = getRepository(Address);

    const client = clientRepository.create({
      name,
    });

    const addressesDataPromises = addresses.map(async address => {
      const { city, state, cep } = address;

      if (!city || !state) {
        const { city: retrievedCity, state: retrievedState } = await findCep(
          cep,
        );
        return {
          ...address,
          city: retrievedCity,
          state: retrievedState,
          client_id: client.id,
        };
      }

      return {
        ...address,
        client_id: client.id,
      };
    });

    const addressesData = await Promise.all(addressesDataPromises);

    const createdAddresses = addressesData.map(address =>
      addressRepository.create(address),
    );

    await getManager().transaction(
      'SERIALIZABLE',
      async transactionalEntityManager => {
        await transactionalEntityManager.save(createdAddresses);
        await transactionalEntityManager.save(client);
      },
    );

    return client;
  }
}

export default CreateClientService;
