import clsx from 'clsx'

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)))
  return (
    <div
      className={clsx('h-2.5 w-full overflow-hidden rounded-full bg-forest-100', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
