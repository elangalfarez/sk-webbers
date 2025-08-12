import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for the treasure hunt
export interface Player {
  id: string
  unique_code: string
  created_at: string
  completed_locations: string[]
  total_score: number
  purchase_amount: number
  is_verified: boolean
}

export interface TreasureLocation {
  id: string
  name: string
  description: string
  qr_code: string
  quiz_question: string
  quiz_options: string[]
  correct_answer: number
  points: number
  is_active: boolean
}

export interface PhotoSubmission {
  id: string
  player_id: string
  location_id: string
  photo_url: string
  metadata: {
    timestamp: string
    deviceInfo: string
    geolocation?: { lat: number; lng: number }
    faceDetected: boolean
    exifValid: boolean
  }
  is_verified: boolean
  created_at: string
}