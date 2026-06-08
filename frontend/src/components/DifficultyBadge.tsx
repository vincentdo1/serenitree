import clsx from 'clsx'
import { DIFFICULTY_META } from '@/lib/game'
import type { Difficulty } from '@/lib/types'

export function DifficultyBadge({
  difficulty,
  showXp = true,
  className,
}: {
  difficulty: Difficulty
  showXp?: boolean
  className?: string
}) {
  const meta = DIFFICULTY_META[difficulty]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        meta.classes,
        className,
      )}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
      {showXp && <span className="opacity-70">· {meta.xp} XP</span>}
    </span>
  )
}
