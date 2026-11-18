import { Request, Response } from 'express';
import { z } from 'zod';
import { ActorContext } from './audit';

export function idParam(req: Request): string {
  const value = req.params.id;
  return typeof value === 'string' ? value : '';
}

export function nestedIdParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === 'string' ? value : '';
}

export function actorContext(req: Request): ActorContext {
  const actor = req.header('x-actor') ?? undefined;
  const ip = req.ip ?? undefined;
  return { actor, ip };
}

export function sendValidationError(res: Response, error: z.ZodError): void {
  res.status(400).json({
    error: 'VALIDATION_ERROR',
    details: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  });
}
