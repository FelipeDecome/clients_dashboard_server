import { getRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '../errors/AppError';

import Client from '../models/Client';

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

    const clientsRepository = getRepository(Client);
    const clientToBeUpdated = await clientsRepository.findOne(id);

    if (!clientToBeUpdated) throw new AppError('Esse ID de usuário não existe');

    clientToBeUpdated.name = name || clientToBeUpdated.name;
    clientToBeUpdated.main_address_id =
      main_address_id || clientToBeUpdated.main_address_id;

    await clientsRepository.save(clientToBeUpdated);

    return clientToBeUpdated;
  }
}

export default UpdateClientService;
