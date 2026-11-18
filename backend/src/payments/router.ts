import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { actorContext, idParam, sendValidationError } from '../http';
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PAYMENT_TYPES,
  annulPayment,
  cashClose,
  createPayment,
  listPayments,
} from './service';

export const createPaymentSchema = z
  .object({
    appointmentId: z.string().min(1).optional(),
    patientId: z.string().min(1).optional(),
    type: z.enum(PAYMENT_TYPES),
    method: z.enum(PAYMENT_METHODS),
    amountCents: z.number().int().positive(),
    externalId: z.string().trim().max(120).optional(),
  })
  .refine((data) => Boolean(data.appointmentId || data.patientId), {
    message: 'El cobro debe asociarse a un turno o a un paciente',
    path: ['appointmentId'],
  })
  .refine((data) => data.type !== 'sena' || Boolean(data.appointmentId), {
    message: 'Una seña debe asociarse a un turno',
    path: ['appointmentId'],
  });

export const listPaymentsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD')
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  appointmentId: z.string().min(1).optional(),
  patientId: z.string().min(1).optional(),
  type: z.enum(PAYMENT_TYPES).optional(),
  method: z.enum(PAYMENT_METHODS).optional(),
  status: z.enum(PAYMENT_STATUSES).optional(),
  includeAnnulled: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export const annulPaymentSchema = z.object({
  reason: z.string().trim().max(240).optional(),
});

export const cashCloseQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD'),
});

export const paymentsRouter = Router();

paymentsRouter.get('/payments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = listPaymentsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    const { includeAnnulled, ...rest } = parsed.data;
    res.json(await listPayments({ ...rest, includeAnnulled: includeAnnulled === 'true' }));
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post('/payments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.status(201).json(await createPayment(parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post(
  '/payments/:id/annul',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = annulPaymentSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        sendValidationError(res, parsed.error);
        return;
      }
      res.json(await annulPayment(idParam(req), parsed.data.reason, actorContext(req)));
    } catch (error) {
      next(error);
    }
  },
);

paymentsRouter.get('/cash/close', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = cashCloseQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await cashClose(parsed.data.date));
  } catch (error) {
    next(error);
  }
});
