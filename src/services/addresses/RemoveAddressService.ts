import { getRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '../../errors/AppError';

import Address from '../../models/Address';
import Client from '../../models/Client';

interface Request {
  id: string;
}

class RemoveAddressService {
  public async execute({ id }: Request): Promise<void> {
    const isIDValid = validate(id);

    if (!isIDValid) throw new AppError('o ID informado é inválido.');

    const addressRepository = getRepository(Address);

    const addressToRemove = await addressRepository.findOne(id);

    if (!addressToRemove) throw new AppError('Esse ID de endereço não existe.');

    const { client_id } = addressToRemove;
    const clientRepository = getRepository(Client);
    const client = await clientRepository.findOne(client_id);

    const main_address_id = client?.main_address_id;

    if (main_address_id === addressToRemove.id)
      throw new AppError('O endereço principal não pode ser removido.');

    await addressRepository.remove(addressToRemove);
  }
}

export default RemoveAddressService;
