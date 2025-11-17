const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllVideos() {
  try {
    console.log('Starting video deletion process...');
    
    // Count current videos
    const videoCount = await prisma.video.count();
    console.log(`Found ${videoCount} videos to delete.`);
    
    if (videoCount === 0) {
      console.log('No videos found to delete.');
      return;
    }
    
    // Delete related records first (foreign key constraints)
    console.log('Deleting related records...');
    
    const deletedStrikes = await prisma.strike.deleteMany({});
    console.log(`Deleted ${deletedStrikes.count} strikes.`);
    
    const deletedReviews = await prisma.manualReview.deleteMany({});
    console.log(`Deleted ${deletedReviews.count} manual reviews.`);
    
    const deletedActivities = await prisma.activity.deleteMany({
      where: { videoId: { not: null } }
    });
    console.log(`Deleted ${deletedActivities.count} video activities.`);
    
    const deletedPayments = await prisma.paymentRecord.deleteMany({
      where: { videoId: { not: null } }
    });
    console.log(`Deleted ${deletedPayments.count} payment records.`);
    
    // Delete all videos
    console.log('Deleting videos...');
    const deletedVideos = await prisma.video.deleteMany({});
    
    console.log(`✅ Successfully deleted ${deletedVideos.count} videos and all related records.`);
    
  } catch (error) {
    console.error('❌ Error deleting videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
deleteAllVideos();