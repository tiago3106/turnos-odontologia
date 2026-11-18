import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { ApiError } from './errors';
import { appointmentsRouter } from './appointments/router';
import { patientsRouter } from './patients/router';
import { catalogRouter } from './catalog/router';
import { paymentsRouter } from './payments/router';
import { config } from './config';
import { openapiDocument } from './openapi';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', env: config.appEnv });
  });

  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/patients', patientsRouter);
  app.use('/api', catalogRouter);
  app.use('/api', paymentsRouter);

  app.get('/api/openapi.json', (_req: Request, res: Response) => {
    res.json(openapiDocument);
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Recurso inexistente' });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.code, message: error.message });
      return;
    }
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: error.issues });
      return;
    }
    const message = error instanceof Error ? error.message : 'Error interno';
    res.status(500).json({ error: 'INTERNAL_ERROR', message });
  });

  return app;
}
