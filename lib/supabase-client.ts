import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions ohne Prisma
export class SupabaseDB {
  
  // Videos
  static async createVideo(data: {
    clipperId: string
    videoLink: string
    platform: string
  }) {
    const { data: video, error } = await supabase
      .from('videos')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return video
  }

  static async getVideosByStatus(status: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        clipper:clipperId (
          id,
          name,
          email
        )
      `)
      .eq('status', status)
      .eq('isDeleted', false)
      .order('submissionDate', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateVideo(id: string, updates: any) {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Clipper
  static async getClipper(id: string) {
    const { data, error } = await supabase
      .from('clipper')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createClipper(data: {
    name: string
    email: string
    username?: string
  }) {
    const { data: clipper, error } = await supabase
      .from('clipper')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return clipper
  }

  // Admin
  static async getAdmin(username: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) throw error
    return data
  }

  // Manual Reviews
  static async createManualReview(data: {
    videoId: string
    reason?: string
    priority?: string
  }) {
    const { data: review, error } = await supabase
      .from('manual_review_queue')
      .insert([{
        ...data,
        priority: data.priority || 'medium'
      }])
      .select()
      .single()
    
    if (error) throw error
    return review
  }

  static async updateManualReview(videoId: string, updates: {
    reviewed: boolean
    reviewDecision?: string
    reviewedAt?: string
    reviewedBy?: string
    adminId?: string
    reviewNotes?: string
  }) {
    const { data, error } = await supabase
      .from('manual_review_queue')
      .update(updates)
      .eq('videoId', videoId)
      .eq('reviewed', false)
    
    if (error) throw error
    return data
  }

  // Activities
  static async logActivity(data: {
    clipperId?: string
    videoId?: string
    adminId?: string
    type: string
    action: string
    description?: string
    metadata?: any
  }) {
    const { data: activity, error } = await supabase
      .from('activities')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return activity
  }

  // Strikes
  static async createStrike(data: {
    clipperId: string
    videoId: string
    reason: string
    type?: string
    severity?: string
  }) {
    const { data: strike, error } = await supabase
      .from('strikes')
      .insert([{
        ...data,
        type: data.type || 'policy_violation',
        severity: data.severity || 'medium'
      }])
      .select()
      .single()
    
    if (error) throw error

    // Update clipper strikes count
    await supabase.rpc('increment_clipper_strikes', { 
      clipper_id: data.clipperId 
    })

    return strike
  }

  // Monthly bonus calculations
  static async getMonthlyBonusVideos(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        clipper:clipperId (
          id,
          name,
          email
        )
      `)
      .eq('status', 'approved')
      .eq('bonusEligible', true)
      .eq('paidOut', false)
      .gte('submissionDate', startDate)
      .lte('submissionDate', endDate)
    
    if (error) throw error
    return data
  }

  // Settings
  static async getSetting(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()
    
    if (error) throw error
    return data.value
  }
}

// SQL Functions (create these in Supabase SQL Editor)
export const SQL_FUNCTIONS = `
-- Function to increment clipper strikes
CREATE OR REPLACE FUNCTION increment_clipper_strikes(clipper_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.clipper 
    SET strikes = strikes + 1 
    WHERE id = clipper_id;
END;
$$ LANGUAGE plpgsql;
`