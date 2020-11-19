import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateClientService from '../services/CreateClientService';

import Client from '../models/Client';

const clientsRouter = Router();

interface CreateClientAddressRequest {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city?: string;
  state?: string;
  isMainAddress?: boolean;
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

export default clientsRouter;
