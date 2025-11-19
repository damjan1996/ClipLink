require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Test verschiedene Client-Typen
async function testRLS() {
  console.log('🧪 Testing RLS Policies...\n');

  // 1. Anon Client (ohne Auth)
  console.log('1️⃣ Testing Anonymous Client:');
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data: settings, error: settingsError } = await anonClient
      .from('settings')
      .select('*');
    console.log('✅ Settings (public read):', settings?.length || 0, 'records');
    
    const { data: videos, error: videosError } = await anonClient
      .from('videos')
      .select('*');
    console.log('❌ Videos (should fail):', videosError ? 'Access denied' : 'ERROR - Should not have access!');
  } catch (err) {
    console.log('Error:', err.message);
  }

  console.log('\n2️⃣ Testing Service Role Client:');
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data: allVideos } = await serviceClient
      .from('videos')
      .select('*');
    console.log('✅ All videos:', allVideos?.length || 0, 'records');
    
    const { data: allClippers } = await serviceClient
      .from('clipper')
      .select('*');
    console.log('✅ All clippers:', allClippers?.length || 0, 'records');
  } catch (err) {
    console.log('Error:', err.message);
  }

  console.log('\n3️⃣ Testing Auth Flow:');
  
  // Create test users if they don't exist
  console.log('Creating test users...');
  
  // Admin user
  const { data: adminAuth, error: adminError } = await serviceClient.auth.admin.createUser({
    email: 'test-admin@cliplink.com',
    password: 'testadmin123',
    email_confirm: true,
    user_metadata: { name: 'Test Admin', role: 'admin' }
  });
  
  if (!adminError) {
    // Update admin record
    await serviceClient
      .from('admins')
      .upsert({
        id: adminAuth.user.id,
        email: 'test-admin@cliplink.com',
        username: 'testadmin',
        password: 'testadmin123',
        role: 'admin',
        isActive: true
      });
    console.log('✅ Test admin created');
  } else if (adminError.message.includes('already been registered')) {
    console.log('ℹ️ Test admin already exists');
  }

  // Clipper user
  const { data: clipperAuth, error: clipperError } = await serviceClient.auth.admin.createUser({
    email: 'test-clipper@cliplink.com',
    password: 'testclipper123',
    email_confirm: true,
    user_metadata: { name: 'Test Clipper', role: 'clipper' }
  });
  
  if (!clipperError) {
    // Update clipper record
    await serviceClient
      .from('clipper')
      .upsert({
        id: clipperAuth.user.id,
        email: 'test-clipper@cliplink.com',
        name: 'Test Clipper',
        username: 'testclipper',
        password: 'testclipper123',
        isActive: true
      });
    console.log('✅ Test clipper created');
  } else if (clipperError.message.includes('already been registered')) {
    console.log('ℹ️ Test clipper already exists');
  }

  // Test login as clipper
  console.log('\n4️⃣ Testing Clipper Access:');
  const { data: clipperSession, error: loginError } = await anonClient.auth.signInWithPassword({
    email: 'test-clipper@cliplink.com',
    password: 'testclipper123'
  });

  if (clipperSession?.user) {
    console.log('✅ Logged in as clipper:', clipperSession.user.email);
    
    // Get clipper's own videos
    const { data: ownVideos, error: ownVideosError } = await anonClient
      .from('videos')
      .select('*')
      .eq('clipperId', clipperSession.user.id);
    
    console.log('✅ Own videos:', ownVideos?.length || 0, 'records');
    
    // Try to access other clipper's videos (should fail)
    const { data: otherVideos, error: otherVideosError } = await anonClient
      .from('videos')
      .select('*')
      .neq('clipperId', clipperSession.user.id);
    
    console.log('❌ Other videos:', otherVideosError ? 'Access denied' : 'ERROR - Should not have access!');
  } else {
    console.log('❌ Login failed:', loginError?.message);
  }

  // Test login as admin
  console.log('\n5️⃣ Testing Admin Access:');
  await anonClient.auth.signOut();
  
  const { data: adminSession } = await anonClient.auth.signInWithPassword({
    email: 'test-admin@cliplink.com',
    password: 'testadmin123'
  });

  if (adminSession?.user) {
    console.log('✅ Logged in as admin:', adminSession.user.email);
    
    // Admin should see all videos
    const { data: allVideosAsAdmin } = await anonClient
      .from('videos')
      .select('*');
    
    console.log('✅ All videos as admin:', allVideosAsAdmin?.length || 0, 'records');
    
    // Admin should see all clippers
    const { data: allClippersAsAdmin } = await anonClient
      .from('clipper')
      .select('*');
    
    console.log('✅ All clippers as admin:', allClippersAsAdmin?.length || 0, 'records');
  }

  console.log('\n✅ RLS Policy Test Complete!');
}

// Run the test
testRLS().catch(console.error);