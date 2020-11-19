import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateClientService from '../services/CreateClientService';

import Client from '../models/Client';
import RemoveClientService from '../services/RemoveClientService';
import UpdateClientService from '../services/UpdateClientService';

const clientsRouter = Router();

interface CreateClientAddressRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city?: string;
  state?: string;
  is_main_address?: boolean;
}

interface CreateClientPhoneRequest {
  number: string;
  is_whatsapp?: boolean;
}

interface CreateClientRequest {
  name: string;
  addresses?: CreateClientAddressRequest[];
  phones?: CreateClientPhoneRequest[];
}

clientsRouter.get('/', async (request, response) => {
  const clientRepository = getRepository(Client);
  const clients = await clientRepository.find();

  return response.json(clients);
});

clientsRouter.post('/', async (request, response) => {
  const { name, addresses, phones } = request.body as CreateClientRequest;

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
