import { getRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '../../errors/AppError';

import Address from '../../models/Address';

interface Request {
  id: string;
  client_id: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  cep?: string;
  city?: string;
  state?: string;
  complement?: string;
}
class UpdateAddressService {
  public async execute({
    id,
    client_id,
    street,
    number,
    neighborhood,
    cep,
    city,
    state,
    complement,
  }: Request): Promise<Address> {
    const isValidID = validate(id);
    const isValidClientID = validate(client_id);

    if (!isValidID) throw new AppError('O ID não é válido.');
    if (!isValidClientID) throw new AppError('O ID do cliente não existe.');

    const addressRepository = getRepository(Address);
    const addressToBeUpdated = await addressRepository.findOne({
      where: {
        id,
        client_id,
      },
    });

    if (!addressToBeUpdated) throw new AppError('O ID do endereço não existe.');

    addressToBeUpdated.street = street || addressToBeUpdated.street;
    addressToBeUpdated.number = number || addressToBeUpdated.number;
    addressToBeUpdated.neighborhood =
      neighborhood || addressToBeUpdated.neighborhood;
    addressToBeUpdated.cep = cep || addressToBeUpdated.cep;
    addressToBeUpdated.city = city || addressToBeUpdated.city;
    addressToBeUpdated.state = state || addressToBeUpdated.state;
    addressToBeUpdated.complement = complement || addressToBeUpdated.complement;

    const addressUpdated = await addressRepository.save(addressToBeUpdated);

    return addressUpdated;
  }
}

export default UpdateAddressService;
