import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={clsx('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-xl text-bark-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: React.ReactNode
  hint?: string
}) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-bark-400">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-forest-700">{value}</p>
      {hint && <p className="mt-1 text-xs text-bark-400">{hint}</p>}
    </div>
  )
}

/** Small pill that signals whether content came from a live model or a fallback. */
export function SourceBadge({ source }: { source: 'llm' | 'local' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        source === 'llm'
          ? 'bg-forest-100 text-forest-700'
          : 'bg-bark-100 text-bark-500',
      )}
      title={
        source === 'llm'
          ? 'Generated live by the configured AI model'
          : 'Sample content — add an API key to enable AI'
      }
    >
      {source === 'llm' ? '✨ AI' : 'Sample'}
    </span>
  )
}
