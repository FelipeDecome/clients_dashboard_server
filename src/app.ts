import 'reflect-metadata';

import express, { json, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';

import './database';

import AppError from './errors/AppError';

import routes from './routes';

const app = express();

app.use(json());
app.use(cors());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError)
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });

  if (app.settings.env === 'development') console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
