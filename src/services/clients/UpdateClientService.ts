import { getRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '../../errors/AppError';
import Address from '../../models/Address';

import Client from '../../models/Client';

interface Request {
  id: string;
  name?: string;
  main_address_id?: string;
}

class UpdateClientService {
  public async execute({
    id,
    name,
    main_address_id,
  }: Request): Promise<Client> {
    const isIDValid = validate(id);

    if (!isIDValid) throw new AppError('o ID informado é inválido.');

    if (!name && !main_address_id)
      throw new AppError('Nenhum dado foi enviado para ser atualizado.');

    const addressRepository = getRepository(Address);
    const main_address = await addressRepository.findOne({
      where: {
        id: main_address_id,
        client_id: id,
      },
    });

    if (!main_address) throw new AppError('Esse ID de endereço não existe.');

    const clientsRepository = getRepository(Client);
    const clientToBeUpdated = await clientsRepository.findOne(id);

    if (!clientToBeUpdated)
      throw new AppError('Esse ID de usuário não existe.');

    if (clientToBeUpdated.main_address_id === main_address_id)
      throw new AppError(
        'Esse endereço já está cadastrado como endereço principal.',
      );

    clientToBeUpdated.name = name || clientToBeUpdated.name;
    clientToBeUpdated.main_address_id =
      main_address_id || clientToBeUpdated.main_address_id;

    const clientUpdated = await clientsRepository.save(clientToBeUpdated);

    return clientUpdated;
  }
}

export default UpdateClientService;
