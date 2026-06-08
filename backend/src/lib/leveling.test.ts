import { describe, expect, it } from 'vitest'
import {
  cumulativeXpForLevel,
  levelFromExp,
  stageForLevel,
  summarizeProgress,
  xpForDifficulty,
} from './leveling'

describe('cumulativeXpForLevel', () => {
  it('follows the triangular curve', () => {
    expect(cumulativeXpForLevel(1)).toBe(0)
    expect(cumulativeXpForLevel(2)).toBe(100)
    expect(cumulativeXpForLevel(3)).toBe(300)
    expect(cumulativeXpForLevel(4)).toBe(600)
    expect(cumulativeXpForLevel(5)).toBe(1000)
  })
})

describe('levelFromExp', () => {
  it('maps XP to the right level at and around thresholds', () => {
    expect(levelFromExp(0)).toBe(1)
    expect(levelFromExp(99)).toBe(1)
    expect(levelFromExp(100)).toBe(2)
    expect(levelFromExp(299)).toBe(2)
    expect(levelFromExp(300)).toBe(3)
    expect(levelFromExp(1000)).toBe(5)
  })

  it('never goes below level 1, even for negative XP', () => {
    expect(levelFromExp(-50)).toBe(1)
  })
})

describe('stageForLevel', () => {
  it('progresses through all five stages', () => {
    expect(stageForLevel(1)).toBe('seedling')
    expect(stageForLevel(2)).toBe('sapling')
    expect(stageForLevel(3)).toBe('sapling')
    expect(stageForLevel(4)).toBe('blooming')
    expect(stageForLevel(5)).toBe('blooming')
    expect(stageForLevel(6)).toBe('mature')
    expect(stageForLevel(8)).toBe('mature')
    expect(stageForLevel(9)).toBe('ancient')
  })
})

describe('xpForDifficulty', () => {
  it('rewards harder monsters with more XP', () => {
    expect(xpForDifficulty('Slime')).toBe(10)
    expect(xpForDifficulty('Goblin')).toBe(25)
    expect(xpForDifficulty('Witch')).toBe(50)
    expect(xpForDifficulty('Dragon')).toBe(100)
  })

  it('defaults unknown difficulties to the easiest reward', () => {
    expect(xpForDifficulty('Unknown')).toBe(10)
  })
})

describe('summarizeProgress', () => {
  it('computes in-level progress correctly', () => {
    const p = summarizeProgress(150)
    expect(p.level).toBe(2)
    expect(p.stage).toBe('sapling')
    expect(p.levelStartXp).toBe(100)
    expect(p.nextLevelXp).toBe(300)
    expect(p.xpIntoLevel).toBe(50)
    expect(p.xpForNextLevel).toBe(200)
    expect(p.progress).toBeCloseTo(0.25)
  })

  it('regression: high XP keeps advancing the stage (old code capped at sapling)', () => {
    // The original frontend could only ever reach "Sapling" because its
    // if/else thresholds were unreachable. Make sure XP keeps growing the tree.
    expect(summarizeProgress(1000).stage).toBe('blooming')
    expect(summarizeProgress(1000).level).toBe(5)
    expect(summarizeProgress(5000).stage).toBe('ancient')
  })
})
