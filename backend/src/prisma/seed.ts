import { PrismaClient, UserRole, CallStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@callmanagement.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@callmanagement.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create Technicians
  const technician1Password = await bcrypt.hash('tech123', 10);
  const technician1 = await prisma.user.upsert({
    where: { email: 'tech1@callmanagement.com' },
    update: {},
    create: {
      name: 'Técnico João',
      email: 'tech1@callmanagement.com',
      password: technician1Password,
      role: UserRole.TECHNICIAN,
      availability: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    },
  });

  const technician2Password = await bcrypt.hash('tech123', 10);
  const technician2 = await prisma.user.upsert({
    where: { email: 'tech2@callmanagement.com' },
    update: {},
    create: {
      name: 'Técnica Maria',
      email: 'tech2@callmanagement.com',
      password: technician2Password,
      role: UserRole.TECHNICIAN,
      availability: ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'],
    },
  });

  const technician3Password = await bcrypt.hash('tech123', 10);
  const technician3 = await prisma.user.upsert({
    where: { email: 'tech3@callmanagement.com' },
    update: {},
    create: {
      name: 'Técnico Pedro',
      email: 'tech3@callmanagement.com',
      password: technician3Password,
      role: UserRole.TECHNICIAN,
      availability: ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00'],
    },
  });

  // Create Services
  const services = [
    {
      name: 'Instalação e atualização de softwares',
      description: 'Instalação e configuração de programas',
      price: 150.00,
    },
    {
      name: 'Instalação e atualização de hardwares',
      description: 'Montagem e upgrade de componentes',
      price: 200.00,
    },
    {
      name: 'Diagnóstico e remoção de vírus',
      description: 'Limpeza e segurança do sistema',
      price: 120.00,
    },
    {
      name: 'Suporte a impressoras',
      description: 'Configuração e reparo de impressoras',
      price: 80.00,
    },
    {
      name: 'Suporte a periféricos',
      description: 'Configuração de dispositivos',
      price: 60.00,
    },
    {
      name: 'Solução de problemas de conectividade',
      description: 'Configuração de rede e internet',
      price: 100.00,
    },
    {
      name: 'Backup e recuperação de dados',
      description: 'Cópia de segurança e recuperação',
      price: 180.00,
    },
    {
      name: 'Otimização de desempenho',
      description: 'Melhoria do desempenho do sistema',
      price: 130.00,
    },
    {
      name: 'Configuração de VPN e Acesso Remoto',
      description: 'Configuração de acesso remoto seguro',
      price: 110.00,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  // Create a test client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@callmanagement.com' },
    update: {},
    create: {
      name: 'Cliente Teste',
      email: 'client@callmanagement.com',
      password: clientPassword,
      role: UserRole.CLIENT,
    },
  });

  // Get created services
  const createdServices = await prisma.service.findMany({
    take: 3,
  });

  // Create a sample call
  if (createdServices.length >= 2) {
    const totalValue = createdServices[0].price + createdServices[1].price;
    
    const call = await prisma.call.create({
      data: {
        title: 'Problema com computador lento',
        description: 'Computador está muito lento e travando frequentemente',
        clientId: client.id,
        technicianId: technician1.id,
        status: CallStatus.ABERTO,
        totalValue,
        services: {
          create: [
            {
              serviceId: createdServices[0].id,
              price: createdServices[0].price,
            },
            {
              serviceId: createdServices[1].id,
              price: createdServices[1].price,
            },
          ],
        },
      },
    });

    console.log('Sample call created:', call.id);
  }

  console.log('Seed completed successfully!');
  console.log('Admin login: admin@callmanagement.com / admin123');
  console.log('Technician login: tech1@callmanagement.com / tech123');
  console.log('Client login: client@callmanagement.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
