import { Router } from 'express';
import { getRepository } from 'typeorm';

import Address from '../models/Address';
import RemoveAddressService from '../services/addresses/RemoveAddressService';
import UpdateAddressService from '../services/addresses/UpdateAddressService';

const addressesRouter = Router();

addressesRouter.get('/', async (request, response) => {
  const { client_id } = request.query;

  const addressRepository = getRepository(Address);
  const addresses = await addressRepository.find({
    where: {
      client_id,
    },
  });

  return response.json({ addresses });
});

addressesRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const addressRepository = getRepository(Address);
  const address = await addressRepository.findOne(id);

  return response.json({ address });
});

addressesRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const addressData = request.body;

  const updateAddressService = new UpdateAddressService();
  const address = updateAddressService.execute({
    id,
    ...addressData,
  });

  return response.json(address);
});

addressesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const removeAddressService = new RemoveAddressService();
  await removeAddressService.execute({ id });

  return response.status(204).send();
});

export default addressesRouter;
