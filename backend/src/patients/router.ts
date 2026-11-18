import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { actorContext, idParam, sendValidationError } from '../http';
import { createPatient, getPatient, listPatients, updatePatient } from './service';

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const dniPattern = /^\d{7,8}$/;

const phoneSchema = z.string().trim().min(5).max(20);
const emailSchema = z.string().trim().regex(emailPattern, 'email inválido');

export const createPatientSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: phoneSchema.optional().nullable(),
    email: emailSchema.optional().nullable(),
    dni: z.string().trim().regex(dniPattern, 'dni debe tener 7 u 8 dígitos').optional().nullable(),
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: 'Se requiere teléfono o email (RN-PA-01)',
    path: ['phone'],
  });

export const updatePatientSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: phoneSchema.optional().nullable(),
    email: emailSchema.optional().nullable(),
    dni: z.string().trim().regex(dniPattern, 'dni debe tener 7 u 8 dígitos').optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviarse al menos un campo',
  });

export const patientsRouter = Router();

patientsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    const patient = await createPatient(parsed.data, actorContext(req));
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
});

patientsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const includeInactive = req.query.includeInactive === 'true';
    res.json(await listPatients({ q, includeInactive }));
  } catch (error) {
    next(error);
  }
});

patientsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getPatient(idParam(req)));
  } catch (error) {
    next(error);
  }
});

patientsRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updatePatientSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    const patient = await updatePatient(idParam(req), parsed.data, actorContext(req));
    res.json(patient);
  } catch (error) {
    next(error);
  }
});
