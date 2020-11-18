import { getManager } from 'typeorm';
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
    // const client = clientRepository.create({
    //   name,
    // });

    // const addressesDataPromises = addresses.map(async address => {
    //   const { city, state, cep } = address;

    //   if (!city || !state) {
    //     const { city: retrievedCity, state: retrievedState } = await findCep(
    //       cep,
    //     );
    //     return {
    //       ...address,
    //       city: retrievedCity,
    //       state: retrievedState,
    //       client_id: client.id,
    //     };
    //   }

    //   return {
    //     ...address,
    //     state: state.toUpperCase(),
    //     client_id: client.id,
    //   };
    // });

    // const addressesData = await Promise.all(addressesDataPromises);

    // const createdAddresses = addressesData.map(address =>
    //   addressRepository.create(address),
    // );

    const newClient = await getManager().transaction(
      async transactionEntityManager => {
        const clientData = transactionEntityManager.create(Client, {
          name,
        });

        const client = await transactionEntityManager.save(clientData);

        const addressesData = await Promise.all(
          addresses.map(async address => {
            const { city, state, cep } = address;

            if (!city || !state) {
              const {
                city: retrievedCity,
                state: retrievedState,
              } = await findCep(cep);
              return {
                ...address,
                city: retrievedCity,
                state: retrievedState,
                client_id: client.id,
              };
            }

            return {
              ...address,
              state: state.toUpperCase(),
              client_id: client.id,
            };
          }),
        );

        const createdAddresses = addressesData.map(address =>
          transactionEntityManager.create(Address, address),
        );

        await transactionEntityManager.save(createdAddresses);

        return client;
      },
    );

    return newClient;
  }
}

export default CreateClientService;
