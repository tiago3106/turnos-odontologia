import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { actorContext, idParam, sendValidationError } from '../http';
import {
  APPOINTMENT_STATUSES,
  cancelAppointment,
  changeAppointmentStatus,
  createAppointment,
  getAppointment,
  listAppointments,
  moveAppointment,
} from './service';

const isoDate = z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), {
  message: 'start debe ser ISO-8601',
});

export const createAppointmentSchema = z.object({
  providerId: z.string().min(1),
  operatingUnitId: z.string().min(1),
  procedureId: z.string().min(1),
  patientName: z.string().min(1).max(120),
  patientId: z.string().min(1).optional(),
  start: isoDate,
  status: z.enum(['pendiente', 'confirmado']).optional(),
});

export const moveAppointmentSchema = z
  .object({
    start: isoDate.optional(),
    providerId: z.string().min(1).optional(),
    operatingUnitId: z.string().min(1).optional(),
    procedureId: z.string().min(1).optional(),
    patientName: z.string().min(1).max(120).optional(),
    patientId: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Debe enviarse al menos un campo' });

export const cancelAppointmentSchema = z.object({
  reason: z.string().trim().max(240).optional(),
});

export const changeStatusSchema = z.object({
  status: z.enum(['confirmado', 'atendido', 'ausente']),
});

export const listAppointmentsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD')
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  providerId: z.string().min(1).optional(),
  operatingUnitId: z.string().min(1).optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  includeCancelled: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export type CreateAppointmentPayload = z.infer<typeof createAppointmentSchema>;

export const appointmentsRouter = Router();

appointmentsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = listAppointmentsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    const { includeCancelled, ...rest } = parsed.data;
    res.json(
      await listAppointments({
        ...rest,
        includeCancelled: includeCancelled === 'true',
      }),
    );
  } catch (error) {
    next(error);
  }
});

appointmentsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    const appointment = await createAppointment(parsed.data);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

appointmentsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAppointment(idParam(req)));
  } catch (error) {
    next(error);
  }
});

appointmentsRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = moveAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await moveAppointment(idParam(req), parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

appointmentsRouter.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = cancelAppointmentSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await cancelAppointment(idParam(req), parsed.data.reason, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

appointmentsRouter.post('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = changeStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await changeAppointmentStatus(idParam(req), parsed.data.status, actorContext(req)));
  } catch (error) {
    next(error);
  }
});
