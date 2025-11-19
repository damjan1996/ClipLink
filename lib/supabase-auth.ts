import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in middleware
          }
        },
      },
    }
  )
}

// Create a service role client for admin operations that bypass RLS
export function createSupabaseServiceClient() {
  const { createClient } = require('@supabase/supabase-js')
  
  // If no service role key, use anon key (for development)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
}

// Helper to get current user from Supabase auth
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

// Helper to check if current user is an admin
export async function isCurrentUserAdmin() {
  const user = await getCurrentUser()
  if (!user) return false
  
  const supabase = await createSupabaseServerClient()
  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, role, isActive')
    .eq('id', user.id)
    .single()
  
  return !error && admin && admin.isActive
}

// Helper to check if current user is a clipper
export async function isCurrentUserClipper() {
  const user = await getCurrentUser()
  if (!user) return false
  
  const supabase = await createSupabaseServerClient()
  const { data: clipper, error } = await supabase
    .from('clipper')
    .select('id, isActive')
    .eq('id', user.id)
    .single()
  
  return !error && clipper && clipper.isActive
}