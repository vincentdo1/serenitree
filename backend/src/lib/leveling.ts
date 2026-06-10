// XP, levels, and tree-stage math. Unit tested in leveling.test.ts.

export const STAGES = ['seedling', 'sapling', 'blooming', 'mature', 'ancient'] as const
export type Stage = (typeof STAGES)[number]

/** Fantasy "monsters" the user defeats, and the XP each is worth. */
export const DIFFICULTY_XP = {
  Slime: 10,
  Goblin: 25,
  Witch: 50,
  Dragon: 100,
} as const
export type Difficulty = keyof typeof DIFFICULTY_XP

export function xpForDifficulty(difficulty: string): number {
  return DIFFICULTY_XP[difficulty as Difficulty] ?? DIFFICULTY_XP.Slime
}

/**
 * Cumulative XP required to *reach* a given level (level 1 starts at 0).
 * Triangular curve: each level costs `level * 100` more than the previous.
 *   L1=0, L2=100, L3=300, L4=600, L5=1000, ...
 */
export function cumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0
  return (100 * (level - 1) * level) / 2
}

export function levelFromExp(exp: number): number {
  const safeExp = Math.max(0, Math.floor(exp))
  let level = 1
  while (cumulativeXpForLevel(level + 1) <= safeExp) level++
  return level
}

export function stageForLevel(level: number): Stage {
  if (level <= 1) return 'seedling'
  if (level <= 3) return 'sapling'
  if (level <= 5) return 'blooming'
  if (level <= 8) return 'mature'
  return 'ancient'
}

export interface PlantProgress {
  exp: number
  level: number
  stage: Stage
  /** XP at the start of the current level. */
  levelStartXp: number
  /** XP needed to reach the next level. */
  nextLevelXp: number
  /** XP earned within the current level. */
  xpIntoLevel: number
  /** XP span of the current level (next - start). */
  xpForNextLevel: number
  /** 0..1 progress through the current level (1 at max curve). */
  progress: number
}

/** Everything the UI needs to render the tree + progress bar, derived from raw XP. */
export function summarizeProgress(exp: number): PlantProgress {
  const safeExp = Math.max(0, Math.floor(exp))
  const level = levelFromExp(safeExp)
  const levelStartXp = cumulativeXpForLevel(level)
  const nextLevelXp = cumulativeXpForLevel(level + 1)
  const xpForNextLevel = nextLevelXp - levelStartXp
  const xpIntoLevel = safeExp - levelStartXp
  const progress = xpForNextLevel > 0 ? Math.min(1, xpIntoLevel / xpForNextLevel) : 1
  return {
    exp: safeExp,
    level,
    stage: stageForLevel(level),
    levelStartXp,
    nextLevelXp,
    xpIntoLevel,
    xpForNextLevel,
    progress,
  }
}
