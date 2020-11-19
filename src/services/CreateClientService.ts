import { getManager } from 'typeorm';
import findCep from 'cep-promise';

import AppError from '../errors/AppError';

import Address from '../models/Address';
import Client from '../models/Client';
import Phone from '../models/Phone';

interface Entity {
  addresses?: Address[];
  phones?: Phone[];
}

interface AddressRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city?: string;
  state?: string;
  is_main_address?: boolean;
}

interface PhoneRequest {
  number: string;
  is_whatsapp?: boolean;
}

interface Request {
  name: string;
  addresses?: AddressRequest[];
  phones?: PhoneRequest[];
}

class CreateClientService {
  public async execute({ name, addresses, phones }: Request): Promise<Client> {
    const createdClient = await getManager().transaction(
      async transactionEntityManager => {
        if (!name) throw new AppError('O nome não pode estar vazio');

        const clientEntity = transactionEntityManager.create(Client, {
          name,
        });

        const client = await transactionEntityManager.save(clientEntity);

        const mainAddress: { index?: number } = {};

        const entities: Entity = {};

        if (addresses) {
          const addressesData = await Promise.all(
            addresses.map(async (address, index) => {
              const { city, state, cep, is_main_address } = address;

              if (is_main_address) mainAddress.index = index;

              try {
                const {
                  city: retrievedCity,
                  state: retrievedState,
                } = await findCep(cep);

                const cityDoesntMatchCEP =
                  city && city.toLowerCase() !== retrievedCity.toLowerCase();

                const stateDoesntMatchCEP =
                  state && state.toUpperCase() !== retrievedState.toUpperCase();

                if (cityDoesntMatchCEP || stateDoesntMatchCEP)
                  throw new AppError(
                    'A Cidade ou Estado não condiz com o CEP informado.',
                  );

                if (!city || !state)
                  return {
                    ...address,
                    city: city || retrievedCity,
                    state: state?.toUpperCase() || retrievedState,
                    client_id: clientEntity.id,
                  };

                return {
                  ...address,
                  state: state.toUpperCase(),
                  client_id: clientEntity.id,
                };
              } catch (err) {
                if (err instanceof AppError)
                  throw new AppError(err.message, err.statusCode);

                throw new AppError(
                  'Houve algum erro buscando pelo cep, verifique se o mesmo está correto',
                  400,
                );
              }
            }),
          );

          const addressesEntities = addressesData.map(address =>
            transactionEntityManager.create(Address, address),
          );

          entities.addresses = await transactionEntityManager.save(
            addressesEntities,
          );
        }

        if (phones) {
          const phonesData = phones.map(phone => {
            const { number, is_whatsapp } = phone;
            if (
              !/(?:^\([0]?[1-9]{2}\)|^[0]?[1-9]{2}[.-\s]?)[9]?[1-9]\d{3}[.-\s]?\d{4}$/.test(
                number,
              )
            )
              throw new AppError('Número de telefone inválido.', 400);

            return {
              number,
              is_whatsapp,
              client_id: client.id,
            };
          });

          const phonesEntities = transactionEntityManager.create(
            Phone,
            phonesData,
          );

          entities.phones = await transactionEntityManager.save(phonesEntities);
        }

        if (
          mainAddress.index !== null &&
          typeof mainAddress.index === 'number' &&
          entities.addresses
        ) {
          const savedAddresses = entities.addresses[mainAddress.index];

          const { id: main_address_id } = savedAddresses;

          clientEntity.main_address_id = main_address_id;

          await transactionEntityManager.save(clientEntity);
        }

        return client;
      },
    );

    return createdClient;
  }
}

export default CreateClientService;
