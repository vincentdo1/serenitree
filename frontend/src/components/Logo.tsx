import clsx from 'clsx'

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest-600 text-white shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path d="M12 22v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M12 14c0-3.6 2.8-6.5 7-6.5 0 3.6-2.8 6.5-7 6.5Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M12 12C12 8.4 9.2 5.5 5 5.5c0 3.6 2.8 6.5 7 6.5Z"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-xl font-semibold tracking-tight text-forest-800">
          Sereni<span className="text-forest-500">tree</span>
        </span>
      )}
    </span>
  )
}
