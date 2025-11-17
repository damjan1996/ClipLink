const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Delete in correct order to respect foreign key constraints
    
    // First delete manual reviews (references videos)
    const deletedReviews = await prisma.manualReview.deleteMany();
    console.log(`✓ Deleted ${deletedReviews.count} manual reviews`);

    // Delete activities
    const deletedActivities = await prisma.activity.deleteMany();
    console.log(`✓ Deleted ${deletedActivities.count} activities`);

    // Delete payment records
    const deletedPayments = await prisma.paymentRecord.deleteMany();
    console.log(`✓ Deleted ${deletedPayments.count} payment records`);

    // Delete strikes
    const deletedStrikes = await prisma.strike.deleteMany();
    console.log(`✓ Deleted ${deletedStrikes.count} strikes`);

    // Finally delete all videos
    const deletedVideos = await prisma.video.deleteMany();
    console.log(`✓ Deleted ${deletedVideos.count} videos`);

    // Reset clipper statistics
    const updatedClippers = await prisma.clipper.updateMany({
      data: {
        totalEarnings: 0,
        totalViews: 0,
        strikes: 0,
        paymentBlocked: false,
      },
    });
    console.log(`✓ Reset statistics for ${updatedClippers.count} clippers`);

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('📝 The database is now ready for your demonstration.');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();