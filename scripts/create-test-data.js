const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test data...');

  // Create test clipper
  const clipper = await prisma.clipper.create({
    data: {
      name: 'Test Clipper',
      email: 'test@example.com',
      registeredChannels: ['youtube', 'tiktok'],
    },
  });

  console.log('✅ Test Clipper created:', clipper);
  console.log('📋 Use this Clipper ID for testing:', clipper.id);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });