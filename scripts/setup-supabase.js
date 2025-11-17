const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...');

  try {
    // Create default admin user
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@cliplink.com',
        password: 'admin123', // In production, use hashed password
        role: 'super_admin',
      },
    });
    console.log('✅ Created default admin user:', admin.username);

    // Create test clipper
    const testClipper = await prisma.clipper.upsert({
      where: { email: 'test@clipper.com' },
      update: {},
      create: {
        name: 'Test Clipper',
        email: 'test@clipper.com',
        username: 'testclipper',
        password: 'test123', // In production, use hashed password
      },
    });
    console.log('✅ Created test clipper:', testClipper.name);

    // Create default settings
    const settings = [
      {
        key: 'bonus_per_10k_views',
        value: '10',
        type: 'number',
        description: 'Bonus amount in EUR for every 10k views'
      },
      {
        key: 'min_views_for_bonus',
        value: '10000',
        type: 'number',
        description: 'Minimum views required for bonus eligibility'
      },
      {
        key: 'max_strikes_allowed',
        value: '3',
        type: 'number',
        description: 'Maximum strikes before payment block'
      }
    ];

    for (const setting of settings) {
      await prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }
    console.log('✅ Created default settings');

    console.log('✨ Database setup complete!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Test Clipper: email=test@clipper.com, password=test123');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();