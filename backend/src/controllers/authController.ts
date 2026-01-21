import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { createAuthResponse } from '../utils/jwt';
import { LoginDto, CreateUserDto } from '../types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'CLIENT']).optional(),
  availability: z.array(z.string()).optional(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const authResponse = createAuthResponse(user);
    res.json(authResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = registerSchema.parse(req.body);

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
        availability: userData.availability || [],
      },
    });

    const authResponse = createAuthResponse(user);
    res.status(201).json(authResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
