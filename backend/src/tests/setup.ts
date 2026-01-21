import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.callService.deleteMany();
  await prisma.call.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
});

afterEach(async () => {
  // Clean up after each test
  await prisma.callService.deleteMany();
  await prisma.call.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
