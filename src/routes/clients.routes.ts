import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateClientService from '../services/clients/CreateClientService';
import RemoveClientService from '../services/clients/RemoveClientService';
import UpdateClientService from '../services/clients/UpdateClientService';

import Client from '../models/Client';

const clientsRouter = Router();

clientsRouter.get('/:id?', async (request, response) => {
  const { id } = request.params;

  const clientRepository = getRepository(Client);

  if (id) {
    const client = await clientRepository.findOne(id);
    return response.json(client);
  }

  const clients = await clientRepository.find();

  return response.json(clients);
});

clientsRouter.post('/', async (request, response) => {
  const { name, addresses, phones } = request.body;

  const createClientService = new CreateClientService();

  const client = await createClientService.execute({
    name,
    addresses,
    phones,
  });

  return response.status(201).json(client);
});

clientsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { name, main_address_id } = request.body;

  const updateClientService = new UpdateClientService();
  const updatedClient = await updateClientService.execute({
    id,
    name,
    main_address_id,
  });

  return response.json({ updatedClient });
});

clientsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const removeClientService = new RemoveClientService();

  await removeClientService.execute({ id });

  return response.status(204).send();
});

export default clientsRouter;
