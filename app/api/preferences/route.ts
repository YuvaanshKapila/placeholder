import { NextResponse } from 'next/server'
import { saveUserPreferences, getUserPreferences } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({})
    }

    const preferences = await getUserPreferences(userId)
    return NextResponse.json(preferences || {})
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({})
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received body:', body)

    if (!body.user_id) {
      console.error('Missing user_id in request')
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const preferences = {
      user_id: body.user_id,
      user_email: body.user_email,
      user_name: body.user_name,
      neurodivergencies: body.neurodivergencies || [],
      crowd_sensitivity: body.crowd_sensitivity || 'medium',
      sound_sensitivity: body.sound_sensitivity || 'medium',
      light_sensitivity: body.light_sensitivity || 'medium',
      touch_avoidance: body.touch_avoidance || 'medium'
    }

    console.log('Attempting to save:', preferences)
    const savedPrefs = await saveUserPreferences(preferences)
    console.log('Successfully saved:', savedPrefs)

    return NextResponse.json({ success: true, preferences: savedPrefs })
  } catch (error) {
    console.error('API Error details:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error message:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
