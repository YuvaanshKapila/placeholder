import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'preferences.json')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

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

interface Database {
  users: { [key: string]: UserPreferences }
}

function readDB(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
      return { users: {} }
    }
    const data = fs.readFileSync(dbPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading database:', error)
    return { users: {} }
  }
}

function writeDB(data: Database) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing database:', error)
    throw error
  }
}

export function saveUserPreferences(prefs: UserPreferences) {
  const db = readDB()

  const now = new Date().toISOString()

  db.users[prefs.user_id] = {
    ...prefs,
    updated_at: now,
    created_at: db.users[prefs.user_id]?.created_at || now
  }

  writeDB(db)
  return db.users[prefs.user_id]
}

export function getUserPreferences(userId: string): UserPreferences | null {
  const db = readDB()
  return db.users[userId] || null
}

export function getAllUsers(): UserPreferences[] {
  const db = readDB()
  return Object.values(db.users).sort((a, b) => {
    const dateA = new Date(a.updated_at || 0).getTime()
    const dateB = new Date(b.updated_at || 0).getTime()
    return dateB - dateA
  })
}
