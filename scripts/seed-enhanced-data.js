const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating enhanced seed data...');

  // Create Admins
  const admin1 = await prisma.admin.create({
    data: {
      username: 'admin',
      email: 'admin@clipper.com',
      password: 'admin123', // In production: use proper hashing
      role: 'super_admin',
    },
  });

  const admin2 = await prisma.admin.create({
    data: {
      username: 'moderator',
      email: 'mod@clipper.com',
      password: 'mod123',
      role: 'admin',
    },
  });

  // Create Test Clippers
  const clippers = await Promise.all([
    prisma.clipper.create({
      data: {
        name: 'Max Mustermann',
        email: 'max@example.com',
        username: 'max_clips',
        registeredChannels: ['youtube', 'tiktok'],
        totalEarnings: 45.60,
        totalViews: 15420,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.clipper.create({
      data: {
        name: 'Anna Schmidt',
        email: 'anna@example.com',
        username: 'anna_creator',
        registeredChannels: ['youtube', 'instagram'],
        totalEarnings: 78.90,
        totalViews: 32150,
        strikes: 1,
        lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
    }),
    prisma.clipper.create({
      data: {
        name: 'Tom Wagner',
        email: 'tom@example.com',
        username: 'tom_viral',
        registeredChannels: ['tiktok'],
        totalEarnings: 156.30,
        totalViews: 89750,
        strikes: 0,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    }),
    prisma.clipper.create({
      data: {
        name: 'Lisa Weber',
        email: 'lisa@example.com',
        username: 'lisa_trends',
        registeredChannels: ['youtube', 'tiktok', 'instagram'],
        totalEarnings: 203.70,
        totalViews: 125680,
        strikes: 3,
        paymentBlocked: true,
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
    }),
  ]);

  console.log('👥 Created clippers:', clippers.map(c => c.name).join(', '));

  // Create Videos for each clipper
  const videos = [];
  
  // Max's videos
  for (let i = 1; i <= 8; i++) {
    const video = await prisma.video.create({
      data: {
        clipperId: clippers[0].id,
        filename: `max_video_${i}.mp4`,
        originalFilename: `Max Gaming Clip ${i}.mp4`,
        uploadLink: `https://youtube.com/watch?v=max${i}`,
        platform: 'youtube',
        videoType: i <= 6 ? 'normal' : 'translation',
        blobUrl: `https://example.com/videos/max_${i}.mp4`,
        fileSize: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
        duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
        validationStatus: i <= 7 ? 'approved' : 'pending',
        confidenceScore: Math.random() * 0.3, // Low confidence (good)
        basePayment: i <= 6 ? 0.60 : 0.30,
        viewCount: Math.floor(Math.random() * 5000) + 1000,
        uploadDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        processedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000 + 60000),
      },
    });
    videos.push(video);
  }

  // Anna's videos (including duplicates and strikes)
  for (let i = 1; i <= 6; i++) {
    const video = await prisma.video.create({
      data: {
        clipperId: clippers[1].id,
        filename: `anna_video_${i}.mp4`,
        originalFilename: `Anna Beauty Tips ${i}.mp4`,
        uploadLink: `https://instagram.com/p/anna${i}`,
        platform: 'instagram',
        videoType: 'normal',
        blobUrl: `https://example.com/videos/anna_${i}.mp4`,
        fileSize: Math.floor(Math.random() * 30000000) + 5000000,
        duration: Math.floor(Math.random() * 180) + 30,
        validationStatus: i === 3 ? 'rejected' : (i === 6 ? 'manual_review' : 'approved'),
        confidenceScore: i === 3 ? 0.95 : (i === 6 ? 0.78 : Math.random() * 0.4),
        basePayment: i !== 3 ? 0.60 : null,
        viewCount: Math.floor(Math.random() * 8000) + 2000,
        uploadDate: new Date(Date.now() - i * 12 * 60 * 60 * 1000),
        processedDate: i <= 5 ? new Date(Date.now() - i * 12 * 60 * 60 * 1000 + 30000) : null,
      },
    });
    videos.push(video);
  }

  // Tom's videos (high performer)
  for (let i = 1; i <= 12; i++) {
    const video = await prisma.video.create({
      data: {
        clipperId: clippers[2].id,
        filename: `tom_viral_${i}.mp4`,
        originalFilename: `Tom Viral Moment ${i}.mp4`,
        uploadLink: `https://tiktok.com/@tom/video${i}`,
        platform: 'tiktok',
        videoType: 'normal',
        blobUrl: `https://example.com/videos/tom_${i}.mp4`,
        fileSize: Math.floor(Math.random() * 25000000) + 8000000,
        duration: Math.floor(Math.random() * 90) + 15, // TikTok style
        validationStatus: 'approved',
        confidenceScore: Math.random() * 0.2,
        basePayment: 0.60,
        bonusPayment: Math.random() * 2.0, // Bonus for viral videos
        viewCount: Math.floor(Math.random() * 15000) + 5000,
        uploadDate: new Date(Date.now() - i * 8 * 60 * 60 * 1000),
        processedDate: new Date(Date.now() - i * 8 * 60 * 60 * 1000 + 45000),
      },
    });
    videos.push(video);
  }

  // Lisa's videos (problematic user with strikes)
  for (let i = 1; i <= 5; i++) {
    const video = await prisma.video.create({
      data: {
        clipperId: clippers[3].id,
        filename: `lisa_content_${i}.mp4`,
        originalFilename: `Lisa Content ${i}.mp4`,
        uploadLink: `https://youtube.com/watch?v=lisa${i}`,
        platform: 'youtube',
        videoType: 'normal',
        blobUrl: `https://example.com/videos/lisa_${i}.mp4`,
        fileSize: Math.floor(Math.random() * 40000000) + 15000000,
        duration: Math.floor(Math.random() * 400) + 100,
        validationStatus: i <= 2 ? 'approved' : 'rejected',
        confidenceScore: i <= 2 ? Math.random() * 0.4 : (0.9 + Math.random() * 0.1),
        basePayment: i <= 2 ? 0.60 : null,
        viewCount: Math.floor(Math.random() * 6000) + 1500,
        uploadDate: new Date(Date.now() - (i + 7) * 24 * 60 * 60 * 1000),
        processedDate: new Date(Date.now() - (i + 7) * 24 * 60 * 60 * 1000 + 120000),
      },
    });
    videos.push(video);
  }

  console.log('🎬 Created', videos.length, 'videos');

  // Create Strikes
  const strikes = await Promise.all([
    // Anna's strike
    prisma.strike.create({
      data: {
        clipperId: clippers[1].id,
        videoId: videos.find(v => v.clipperId === clippers[1].id && v.validationStatus === 'rejected').id,
        reason: 'Duplicate content detected',
        type: 'duplicate',
        severity: 'medium',
      },
    }),
    // Lisa's strikes
    prisma.strike.create({
      data: {
        clipperId: clippers[3].id,
        videoId: videos.find(v => v.clipperId === clippers[3].id && v.validationStatus === 'rejected').id,
        reason: 'Suspected duplicate content',
        type: 'duplicate',
        severity: 'high',
      },
    }),
    prisma.strike.create({
      data: {
        clipperId: clippers[3].id,
        videoId: videos[videos.length - 1].id,
        reason: 'Policy violation - inappropriate content',
        type: 'policy_violation',
        severity: 'high',
      },
    }),
    prisma.strike.create({
      data: {
        clipperId: clippers[3].id,
        videoId: videos[videos.length - 2].id,
        reason: 'Multiple duplicate uploads',
        type: 'duplicate',
        severity: 'medium',
      },
    }),
  ]);

  console.log('⚠️ Created', strikes.length, 'strikes');

  // Create Manual Reviews
  const manualReviews = await Promise.all([
    prisma.manualReview.create({
      data: {
        videoId: videos.find(v => v.validationStatus === 'manual_review').id,
        confidenceScore: 0.78,
        reason: 'Borderline duplicate detection',
        priority: 'medium',
        adminId: admin2.id,
      },
    }),
  ]);

  // Create Activities (recent actions)
  const activities = [
    // Recent uploads
    { type: 'upload', action: 'video_uploaded', clipperId: clippers[2].id },
    { type: 'review', action: 'manual_review_completed', adminId: admin2.id },
    { type: 'login', action: 'clipper_login', clipperId: clippers[0].id },
    { type: 'strike', action: 'strike_issued', clipperId: clippers[3].id },
    { type: 'payment', action: 'payment_processed', clipperId: clippers[2].id },
  ];

  for (let activity of activities) {
    await prisma.activity.create({
      data: {
        ...activity,
        description: `${activity.action.replace('_', ' ')} performed`,
        metadata: { source: 'seed_data' },
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create Payment Records
  for (let clipper of clippers) {
    const clipperVideos = videos.filter(v => v.clipperId === clipper.id && v.validationStatus === 'approved');
    
    for (let video of clipperVideos) {
      if (video.basePayment) {
        await prisma.paymentRecord.create({
          data: {
            clipperId: clipper.id,
            videoId: video.id,
            amount: video.basePayment + (video.bonusPayment || 0),
            type: video.bonusPayment ? 'bonus' : 'base_payment',
            status: 'processed',
            description: `Payment for video: ${video.filename}`,
            processedAt: new Date(video.uploadDate.getTime() + 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  // Create System Settings
  await Promise.all([
    prisma.settings.create({
      data: {
        key: 'duplicate_threshold_auto_reject',
        value: '0.9',
        type: 'number',
        description: 'Confidence threshold for automatic rejection',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'duplicate_threshold_manual_review',
        value: '0.7',
        type: 'number',
        description: 'Confidence threshold for manual review',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'base_payment_normal',
        value: '0.60',
        type: 'number',
        description: 'Base payment for normal clips',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'base_payment_translation',
        value: '0.30',
        type: 'number',
        description: 'Base payment for translation clips',
      },
    }),
  ]);

  console.log('✅ Enhanced seed data created successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 Admins created');
  console.log('- 4 Clippers created');
  console.log('- 31 Videos created');
  console.log('- 4 Strikes issued');
  console.log('- 1 Manual review pending');
  console.log('- Payment records generated');
  console.log('- System settings configured');
  
  console.log('\n🔑 Admin Login:');
  console.log('Username: admin | Password: admin123 (Super Admin)');
  console.log('Username: moderator | Password: mod123 (Admin)');
  
  console.log('\n👤 Test Clippers:');
  clippers.forEach(clipper => {
    console.log(`- ${clipper.name} (${clipper.email}) - ID: ${clipper.id}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error creating seed data:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });