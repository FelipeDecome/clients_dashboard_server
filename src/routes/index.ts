import { Router } from 'express';
import addressesRouter from './addresses.routes';

import clientsRouter from './clients.routes';

const routes = Router();

routes.use('/clients', clientsRouter);
routes.use('/address', addressesRouter);

export default routes;
