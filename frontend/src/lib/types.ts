export type Stage = 'seedling' | 'sapling' | 'blooming' | 'mature' | 'ancient'
export type Difficulty = 'Slime' | 'Goblin' | 'Witch' | 'Dragon'

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface PlantProgress {
  exp: number
  level: number
  stage: Stage
  levelStartXp: number
  nextLevelXp: number
  xpIntoLevel: number
  xpForNextLevel: number
  progress: number
}

export interface Quest {
  id: string
  userId: string
  title: string
  description: string
  category: string | null
  difficulty: Difficulty
  xpReward: number
  completed: boolean
  completedAt: string | null
  dueDate: string | null
  createdAt: string
}

export interface Reflection {
  id: string
  userId: string
  questId: string | null
  message: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface MeResponse {
  user: User
  plant: PlantProgress
}

export interface QuestActionResponse {
  quest: Quest
  plant: PlantProgress
}

export interface RecapStats {
  questsCompleted: number
  reflectionsWritten: number
  xpEarned: number
  level: number
  stage: Stage
}

export interface RecapResponse {
  summary: string
  stats: RecapStats
  source: 'llm' | 'local'
}

export interface QuestIdea {
  title: string
  difficulty: Difficulty
  description: string
}
