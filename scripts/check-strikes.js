const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkStrikes() {
  try {
    console.log('⚠️ Analyzing Strike System...\n');

    const strikes = await prisma.strike.findMany({
      include: {
        clipper: true,
        video: true,
      },
      orderBy: { issuedDate: 'desc' }
    });

    console.log(`📊 Total Strikes: ${strikes.length}\n`);

    // Group by type
    const strikesByType = strikes.reduce((acc, strike) => {
      acc[strike.type] = acc[strike.type] || [];
      acc[strike.type].push(strike);
      return acc;
    }, {});

    Object.entries(strikesByType).forEach(([type, typeStrikes]) => {
      console.log(`🔴 ${type.toUpperCase()} STRIKES (${typeStrikes.length}):`);
      
      typeStrikes.forEach(strike => {
        console.log(`  └─ ${strike.clipper.name}: "${strike.reason}"`);
        console.log(`     Video: ${strike.video.filename} | Severity: ${strike.severity}`);
        console.log(`     Date: ${strike.issuedDate.toLocaleDateString()}\n`);
      });
    });

    // Clipper Status
    console.log('👥 CLIPPER STATUS:');
    const clippers = await prisma.clipper.findMany({
      include: { strikes_issued: true }
    });

    clippers.forEach(clipper => {
      const status = clipper.paymentBlocked ? '🚫 BLOCKED' : 
                    clipper.strikes >= 2 ? '⚠️ WARNING' : '✅ GOOD';
      
      console.log(`  ${status} ${clipper.name}: ${clipper.strikes} strikes`);
      if (clipper.paymentBlocked) {
        console.log(`    └─ Payments blocked due to ${clipper.strikes}+ strikes`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStrikes();