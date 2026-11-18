import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { actorContext, idParam, nestedIdParam, sendValidationError } from '../http';
import {
  createOperatingUnit,
  createProcedure,
  createProvider,
  createProviderSchedule,
  listOperatingUnits,
  listProcedures,
  listProviderSchedules,
  listProviders,
  listProvidersWithSchedules,
  updateOperatingUnit,
  updateProcedure,
  updateProvider,
} from './service';

const colorPattern = /^#[0-9a-fA-F]{6}$/;

export const createProcedureSchema = z.object({
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(120),
  defaultDurationMin: z.number().int().min(5).max(480),
  priceCents: z.number().int().min(0),
});

export const updateProcedureSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    defaultDurationMin: z.number().int().min(5).max(480).optional(),
    priceCents: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Debe enviarse al menos un campo' });

export const createProviderSchema = z.object({
  name: z.string().trim().min(1).max(120),
  specialty: z.string().trim().max(80).optional().nullable(),
  color: z.string().trim().regex(colorPattern, 'color debe ser #RRGGBB').optional().nullable(),
});

export const updateProviderSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    specialty: z.string().trim().max(80).optional().nullable(),
    color: z.string().trim().regex(colorPattern, 'color debe ser #RRGGBB').optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Debe enviarse al menos un campo' });

export const createOperatingUnitSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const updateOperatingUnitSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Debe enviarse al menos un campo' });

export const createProviderScheduleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startMinute: z.number().int().min(0).max(1439),
    endMinute: z.number().int().min(1).max(1440),
    intervalMin: z.number().int().min(5).max(120),
  })
  .refine((data) => data.startMinute < data.endMinute, {
    message: 'startMinute debe ser menor que endMinute',
    path: ['endMinute'],
  });

function includeInactive(req: Request): boolean {
  return req.query.includeInactive === 'true';
}

export const catalogRouter = Router();

catalogRouter.get('/procedures', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listProcedures(includeInactive(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.post('/procedures', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createProcedureSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.status(201).json(await createProcedure(parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.patch('/procedures/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateProcedureSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await updateProcedure(idParam(req), parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/providers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listProviders(includeInactive(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.post('/providers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createProviderSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.status(201).json(await createProvider(parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.patch('/providers/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateProviderSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await updateProvider(idParam(req), parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/operating-units', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listOperatingUnits(includeInactive(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.post('/operating-units', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createOperatingUnitSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.status(201).json(await createOperatingUnit(parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.patch('/operating-units/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateOperatingUnitSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }
    res.json(await updateOperatingUnit(idParam(req), parsed.data, actorContext(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/schedule/providers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listProvidersWithSchedules());
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/schedule/sills', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listOperatingUnits(includeInactive(req)));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get(
  '/schedule/providers/:id/schedules',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await listProviderSchedules(idParam(req)));
    } catch (error) {
      next(error);
    }
  },
);

catalogRouter.post(
  '/schedule/providers/:id/schedules',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createProviderScheduleSchema.safeParse(req.body);
      if (!parsed.success) {
        sendValidationError(res, parsed.error);
        return;
      }
      const schedule = await createProviderSchedule(
        nestedIdParam(req, 'id'),
        parsed.data,
        actorContext(req),
      );
      res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  },
);
