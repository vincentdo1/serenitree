'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { STAGE_META } from '@/lib/game'
import type { Stage } from '@/lib/types'

// Animates between stages: when `stage` changes the previous tree fades out while
// the new one grows in, then settles back into the idle sway.
export function TreeVisual({
  stage,
  size = 240,
  animate = true,
  className,
}: {
  stage: Stage
  size?: number
  animate?: boolean
  className?: string
}) {
  const [current, setCurrent] = useState(stage)
  const [previous, setPrevious] = useState<Stage | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (stage === current) return
    setPrevious(current)
    setCurrent(stage)
    const t = setTimeout(() => setPrevious(null), 850)
    return () => clearTimeout(t)
  }, [stage, current])

  const transitioning = previous !== null

  return (
    <div
      className={clsx('relative', animate && !transitioning && 'origin-bottom animate-sway', className)}
      style={{ width: size, height: size }}
    >
      {previous && (
        <Image
          key={previous}
          src={STAGE_META[previous].image}
          alt=""
          aria-hidden
          width={size}
          height={size}
          className="absolute inset-0 animate-tree-out select-none"
        />
      )}
      <Image
        key={current}
        src={STAGE_META[current].image}
        alt={`${STAGE_META[current].label} tree`}
        width={size}
        height={size}
        priority
        className={clsx(
          'absolute inset-0 select-none drop-shadow-[0_18px_25px_rgba(24,61,34,0.18)]',
          transitioning && 'animate-tree-in',
        )}
      />
    </div>
  )
}
