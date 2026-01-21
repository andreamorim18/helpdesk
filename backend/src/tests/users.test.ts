import request from 'supertest';
import app from '../index';
import { prisma } from './setup';
import bcrypt from 'bcryptjs';

describe('Users', () => {
  let adminToken: string;
  let technicianToken: string;
  let clientToken: string;

  beforeEach(async () => {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.token;

    // Create technician user
    const techPassword = await bcrypt.hash('tech123', 10);
    await prisma.user.create({
      data: {
        name: 'Tech User',
        email: 'tech@example.com',
        password: techPassword,
        role: 'TECHNICIAN',
        availability: ['08:00', '09:00', '10:00', '11:00']
      }
    });

    const techLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tech@example.com', password: 'tech123' });
    technicianToken = techLogin.body.token;

    // Create client user
    const clientPassword = await bcrypt.hash('client123', 10);
    await prisma.user.create({
      data: {
        name: 'Client User',
        email: 'client@example.com',
        password: clientPassword,
        role: 'CLIENT'
      }
    });

    const clientLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'client@example.com', password: 'client123' });
    clientToken = clientLogin.body.token;
  });

  describe('POST /api/users/technicians', () => {
    it('should create technician as admin', async () => {
      const technicianData = {
        name: 'New Technician',
        email: 'newtech@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/technicians')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(technicianData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(technicianData.name);
      expect(response.body.email).toBe(technicianData.email);
      expect(response.body.role).toBe('TECHNICIAN');
      expect(response.body.availability).toContain('08:00');
    });

    it('should not allow technician to create technician', async () => {
      const technicianData = {
        name: 'New Technician',
        email: 'newtech@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/technicians')
        .set('Authorization', `Bearer ${technicianToken}`)
        .send(technicianData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should not allow client to create technician', async () => {
      const technicianData = {
        name: 'New Technician',
        email: 'newtech@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/technicians')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(technicianData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/technicians', () => {
    beforeEach(async () => {
      // Create some technicians
      const techPassword = await bcrypt.hash('tech123', 10);
      await prisma.user.createMany({
        data: [
          {
            name: 'Tech 1',
            email: 'tech1@example.com',
            password: techPassword,
            role: 'TECHNICIAN',
            availability: ['08:00', '09:00']
          },
          {
            name: 'Tech 2',
            email: 'tech2@example.com',
            password: techPassword,
            role: 'TECHNICIAN',
            availability: ['10:00', '11:00']
          }
        ]
      });
    });

    it('should list technicians as admin', async () => {
      const response = await request(app)
        .get('/api/users/technicians')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach((tech: any) => {
        expect(tech.role).toBe('TECHNICIAN');
        expect(tech).toHaveProperty('availability');
        expect(tech).not.toHaveProperty('password');
      });
    });

    it('should not allow technician to list technicians', async () => {
      const response = await request(app)
        .get('/api/users/technicians')
        .set('Authorization', `Bearer ${technicianToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get own profile as technician', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${technicianToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should get own profile as client', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body.role).toBe('CLIENT');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update own profile as technician', async () => {
      const updateData = {
        name: 'Updated Technician Name'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${technicianToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });

    it('should update own profile as client', async () => {
      const updateData = {
        name: 'Updated Client Name'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });

    it('should update password', async () => {
      const updateData = {
        password: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(updateData)
        .expect(200);

      // Try to login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'client@example.com',
          password: 'newpassword123'
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
    });
  });
});
