import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createAppointment } from './service';

export const createAppointmentSchema = z.object({
  providerId: z.string().min(1),
  operatingUnitId: z.string().min(1),
  procedureId: z.string().min(1),
  patientName: z.string().min(1).max(120),
  start: z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: 'start debe ser ISO-8601',
  }),
});

export type CreateAppointmentPayload = z.infer<typeof createAppointmentSchema>;

export const appointmentsRouter = Router();

appointmentsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    const appointment = await createAppointment(parsed.data);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});
