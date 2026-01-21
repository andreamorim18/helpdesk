import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import serviceRoutes from './routes/services';
import callRoutes from './routes/calls';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Call Management System API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
