import { Router } from 'express';

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

clientsRouter.post('/', (request, response) => {
  const { name, addresses } = request.body as CreateClientRequest;

  return response.json({ name, addresses });
});

export default clientsRouter;
