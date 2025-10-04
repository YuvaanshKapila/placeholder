import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkcybqchaaltdpjqazgz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY3licWNoYWFsdGRwanFhemd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODc0ODcsImV4cCI6MjA3NTE2MzQ4N30.AXhQC2H_WasAPG6qLC3kU6xkqFwooaEhibnsqqHBI9s'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface UserPreferences {
  user_id: string
  user_email?: string
  user_name?: string
  neurodivergencies?: string[]
  crowd_sensitivity: string
  sound_sensitivity: string
  light_sensitivity: string
  touch_avoidance: string
  created_at?: string
  updated_at?: string
}

export async function saveUserPreferences(prefs: UserPreferences) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: prefs.user_id,
      user_email: prefs.user_email,
      user_name: prefs.user_name,
      neurodivergencies: prefs.neurodivergencies || [],
      crowd_sensitivity: prefs.crowd_sensitivity,
      sound_sensitivity: prefs.sound_sensitivity,
      light_sensitivity: prefs.light_sensitivity,
      touch_avoidance: prefs.touch_avoidance,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return data
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null
    }
    console.error('Error fetching preferences:', error)
    return null
  }

  return data
}

export async function getAllUsers(): Promise<UserPreferences[]> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching all users:', error)
    return []
  }

  return data || []
}
