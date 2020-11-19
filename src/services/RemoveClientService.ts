import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Client from '../models/Client';

interface Request {
  id: string;
}

class RemoveClientService {
  public async execute({ id }: Request): Promise<void> {
    const clientRepository = getRepository(Client);

    const clientToRemove = await clientRepository.findOne(id);

    if (!clientToRemove) throw new AppError('Esse ID de usuário não existe.');

    await clientRepository.remove(clientToRemove);
  }
}

export default RemoveClientService;
