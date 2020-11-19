import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateClientService from '../services/CreateClientService';

import Client from '../models/Client';

const clientsRouter = Router();

interface CreateAddressRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city?: string;
  state?: string;
}

interface CreateClientRequest {
  name: string;
  addresses: CreateAddressRequest[];
}

clientsRouter.get('/', async (request, response) => {
  const clientRepository = getRepository(Client);
  const clients = await clientRepository.find();

  return response.json(clients);
});

clientsRouter.post('/', async (request, response) => {
  const { name, addresses } = request.body as CreateClientRequest;

  const createClientService = new CreateClientService();

  const client = await createClientService.execute({
    name,
    addresses,
  });

  return response.status(201).json(client);
});

clientsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  return response.json({ id });
});

clientsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  return response.json({ id });
});

export default clientsRouter;
