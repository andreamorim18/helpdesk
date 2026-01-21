import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { requireAdmin, requireTechnician, requireClient } from '../middleware/auth';
import { CreateUserDto, UpdateUserDto } from '../types';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'CLIENT']),
  availability: z.array(z.string()).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  availability: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

export const createTechnician = async (req: Request, res: Response) => {
  try {
    const userData = createUserSchema.parse({
      ...req.body,
      role: 'TECHNICIAN',
      availability: req.body.availability || ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        availability: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      select: {
        id: true,
        name: true,
        email: true,
        availability: true,
        createdAt: true,
      },
    });

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTechnician = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = updateUserSchema.parse(req.body);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const technician = await prisma.user.update({
      where: { id, role: 'TECHNICIAN' },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        availability: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.json(technician);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            createdCalls: true,
          },
        },
      },
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = updateUserSchema.parse(req.body);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const client = await prisma.user.update({
      where: { id, role: 'CLIENT' },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id, role: 'CLIENT' },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        availability: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updateData = updateUserSchema.parse(req.body);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        availability: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
