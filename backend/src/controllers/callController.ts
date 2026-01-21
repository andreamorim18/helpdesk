import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { CreateCallDto, UpdateCallDto } from '../types';

const createCallSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  technicianId: z.string().min(1),
  serviceIds: z.array(z.string()).min(1),
});

const updateCallSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['ABERTO', 'EM_ATENDIMENTO', 'ENCERRADO']).optional(),
  serviceIds: z.array(z.string()).optional(),
});

export const createCall = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, description, technicianId, serviceIds } = createCallSchema.parse(req.body);

    // Verify technician exists and is available
    const technician = await prisma.user.findUnique({
      where: { id: technicianId, role: 'TECHNICIAN' },
    });

    if (!technician) {
      return res.status(400).json({ error: 'Invalid technician' });
    }

    // Get services and calculate total value
    const services = await prisma.service.findMany({
      where: { 
        id: { in: serviceIds },
        isActive: true 
      },
    });

    if (services.length !== serviceIds.length) {
      return res.status(400).json({ error: 'One or more services are invalid or inactive' });
    }

    const totalValue = services.reduce((sum: number, service: any) => sum + service.price, 0);

    const call = await prisma.call.create({
      data: {
        title,
        description,
        clientId: userId,
        technicianId,
        totalValue,
        services: {
          create: services.map((service: any) => ({
            serviceId: service.id,
            price: service.price,
          })),
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    res.status(201).json(call);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listCalls = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { status } = req.query;

    let whereClause: any = {};

    if (userRole === 'CLIENT') {
      whereClause.clientId = userId;
    } else if (userRole === 'TECHNICIAN') {
      whereClause.technicianId = userId;
    }

    if (status) {
      whereClause.status = status;
    }

    const calls = await prisma.call.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const call = await prisma.call.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Check permissions
    if (userRole === 'CLIENT' && call.clientId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (userRole === 'TECHNICIAN' && call.technicianId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const updateData = updateCallSchema.parse(req.body);

    const call = await prisma.call.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Check permissions
    if (userRole === 'CLIENT') {
      return res.status(403).json({ error: 'Clients cannot update calls' });
    }

    if (userRole === 'TECHNICIAN' && call.technicianId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle service updates
    if (updateData.serviceIds) {
      const services = await prisma.service.findMany({
        where: { 
          id: { in: updateData.serviceIds },
          isActive: true 
        },
      });

      if (services.length !== updateData.serviceIds.length) {
        return res.status(400).json({ error: 'One or more services are invalid or inactive' });
      }

      // Remove existing services
      await prisma.callService.deleteMany({
        where: { callId: id },
      });

      // Add new services
      const totalValue = services.reduce((sum: number, service: any) => sum + service.price, 0);

      await prisma.call.update({
        where: { id },
        data: {
          totalValue,
          services: {
            create: services.map((service: any) => ({
              serviceId: service.id,
              price: service.price,
            })),
          },
        },
      });

      delete updateData.serviceIds;
    }

    const updatedCall = await prisma.call.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    res.json(updatedCall);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const call = await prisma.call.findUnique({
      where: { id },
    });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Only admin or the client who created the call can delete it
    if (userRole !== 'ADMIN' && (userRole !== 'CLIENT' || call.clientId !== userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.call.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
