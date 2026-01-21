import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)'));
  }
};

// Configuração do upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

export const uploadAvatar = upload.single('avatar');
