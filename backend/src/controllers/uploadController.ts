import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import path from 'path';

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Atualiza o avatar do usuário no banco
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: `/uploads/${req.file.filename}`
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      }
    });

    res.json({
      message: 'Avatar atualizado com sucesso',
      user
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do avatar' });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Remove o avatar do usuário
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      }
    });

    res.json({
      message: 'Avatar removido com sucesso',
      user
    });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    res.status(500).json({ error: 'Erro ao remover avatar' });
  }
};
