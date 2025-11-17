const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('📊 Checking database content...\n');

    // Check Clippers
    const clippers = await prisma.clipper.findMany();
    console.log(`👥 Clippers (${clippers.length}):`);
    clippers.forEach(clipper => {
      console.log(`  - ${clipper.name} (${clipper.email}) - ${clipper.strikes} strikes`);
    });
    console.log();

    // Check Videos
    const videos = await prisma.video.findMany({
      include: { clipper: true }
    });
    console.log(`🎬 Videos (${videos.length}):`);
    videos.forEach(video => {
      console.log(`  - ${video.filename} by ${video.clipper.name} (${video.validationStatus})`);
    });
    console.log();

    // Check Strikes
    const strikes = await prisma.strike.findMany({
      include: { clipper: true, video: true }
    });
    console.log(`⚠️ Strikes (${strikes.length}):`);
    strikes.forEach(strike => {
      console.log(`  - ${strike.clipper.name}: ${strike.reason}`);
    });
    console.log();

    // Check Manual Reviews
    const reviews = await prisma.manualReview.findMany({
      include: { video: { include: { clipper: true } } }
    });
    console.log(`🔍 Manual Reviews (${reviews.length}):`);
    reviews.forEach(review => {
      console.log(`  - ${review.video.filename} by ${review.video.clipper.name} (${review.confidenceScore * 100}%)`);
    });
    console.log();

    // Check Admins
    const admins = await prisma.admin.findMany();
    console.log(`👨‍💼 Admins (${admins.length}):`);
    admins.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.role}) - Last login: ${admin.lastLogin || 'Never'}`);
    });

    console.log('\n✅ Database check complete!');
    console.log('\n🌐 To view in browser: http://localhost:5555 (Prisma Studio)');
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();