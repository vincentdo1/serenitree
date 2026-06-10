import type { StaticImageData } from 'next/image'
import type { Difficulty, Stage } from './types'

import seedling from '@/images/tree1.png'
import sapling from '@/images/tree2.png'
import blooming from '@/images/tree3.png'
import mature from '@/images/tree4.png'
import ancient from '@/images/tree5.png'

export const STAGE_META: Record<Stage, { label: string; image: StaticImageData; blurb: string }> = {
  seedling: { label: 'Seedling', image: seedling, blurb: 'A tiny sprout, full of promise.' },
  sapling: { label: 'Sapling', image: sapling, blurb: 'Roots are taking hold.' },
  blooming: { label: 'Blooming', image: blooming, blurb: 'Bursting into fresh leaf.' },
  mature: { label: 'Mature', image: mature, blurb: 'Strong, steady, and thriving.' },
  ancient: { label: 'Ancient', image: ancient, blurb: 'A towering testament to your growth.' },
}

export const STAGE_ORDER: Stage[] = ['seedling', 'sapling', 'blooming', 'mature', 'ancient']

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; xp: number; emoji: string; classes: string }
> = {
  Slime: { label: 'Slime', xp: 10, emoji: '🫧', classes: 'bg-forest-100 text-forest-700' },
  Goblin: { label: 'Goblin', xp: 25, emoji: '👺', classes: 'bg-amber-100 text-amber-700' },
  Witch: { label: 'Witch', xp: 50, emoji: '🧙', classes: 'bg-purple-100 text-purple-700' },
  Dragon: { label: 'Dragon', xp: 100, emoji: '🐉', classes: 'bg-rose-100 text-rose-700' },
}

export const DIFFICULTIES: Difficulty[] = ['Slime', 'Goblin', 'Witch', 'Dragon']
