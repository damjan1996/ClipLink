import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase tables
export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          role: string
          createdAt: string
          lastLogin: string | null
          isActive: boolean
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          role?: string
          createdAt?: string
          lastLogin?: string | null
          isActive?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          role?: string
          createdAt?: string
          lastLogin?: string | null
          isActive?: boolean
        }
      }
      clipper: {
        Row: {
          id: string
          name: string
          email: string
          username: string | null
          password: string | null
          registeredChannels: any | null
          strikes: number
          paymentBlocked: boolean
          isActive: boolean
          totalEarnings: number
          totalViews: number
          createdAt: string
          lastActivity: string | null
        }
      }
      videos: {
        Row: {
          id: string
          clipperId: string
          videoLink: string
          platform: string
          title: string | null
          description: string | null
          thumbnailUrl: string | null
          duration: number | null
          uploadDate: string | null
          submissionDate: string
          viewCount: number
          lastViewCheck: string | null
          status: string
          bonusEligible: boolean
          paidOut: boolean
          bonusAmount: number | null
          notes: string | null
          isDeleted: boolean
          metadata: any | null
        }
      }
      strikes: {
        Row: {
          id: string
          clipperId: string
          videoId: string
          reason: string
          type: string
          severity: string
          issuedDate: string
          resolved: boolean
          resolvedBy: string | null
          resolvedAt: string | null
          notes: string | null
        }
      }
      manual_review_queue: {
        Row: {
          id: string
          videoId: string
          reason: string | null
          priority: string
          addedToQueue: string
          reviewed: boolean
          reviewedBy: string | null
          adminId: string | null
          reviewDecision: string | null
          reviewedAt: string | null
          reviewNotes: string | null
        }
      }
      activities: {
        Row: {
          id: string
          clipperId: string | null
          videoId: string | null
          adminId: string | null
          type: string
          action: string
          description: string | null
          metadata: any | null
          ipAddress: string | null
          userAgent: string | null
          timestamp: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          type: string
          description: string | null
          updatedAt: string
        }
      }
      payment_records: {
        Row: {
          id: string
          clipperId: string
          videoId: string | null
          amount: number
          type: string
          status: string
          description: string | null
          metadata: any | null
          processedAt: string | null
          createdAt: string
        }
      }
    }
  }
}