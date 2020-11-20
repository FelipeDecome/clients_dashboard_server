import { getRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '../../errors/AppError';

import Client from '../../models/Client';

interface Request {
  id: string;
}

class RemoveClientService {
  public async execute({ id }: Request): Promise<void> {
    const isIDValid = validate(id);

    if (!isIDValid) throw new AppError('o ID informado é inválido.');

    const clientRepository = getRepository(Client);

    const clientToRemove = await clientRepository.findOne(id);

    if (!clientToRemove) throw new AppError('Esse ID de usuário não existe.');

    await clientRepository.remove(clientToRemove);
  }
}

export default RemoveClientService;
