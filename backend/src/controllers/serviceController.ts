import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { CreateServiceDto, UpdateServiceDto } from '../types';

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
});

const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const createService = async (req: Request, res: Response) => {
  try {
    const serviceData = createServiceSchema.parse(req.body);

    const service = await prisma.service.create({
      data: serviceData,
    });

    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listServices = async (req: Request, res: Response) => {
  try {
    const { activeOnly } = req.query;
    
    const services = await prisma.service.findMany({
      where: activeOnly === 'true' ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = updateServiceSchema.parse(req.body);

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deactivateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
