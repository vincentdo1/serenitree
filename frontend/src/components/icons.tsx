type IconProps = React.ComponentPropsWithoutRef<'svg'>

const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.7,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}

export function IconScroll(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3h9a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H7a2 2 0 0 1-2-2V6" />
      <path d="M5 6a2 2 0 1 1 4 0v12" />
      <path d="M10 8h6M10 12h6M10 16h3" />
    </svg>
  )
}

export function IconSprout(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3 2.5-5.5 6-5.5 0 3-2.5 5.5-6 5.5Z" />
      <path d="M12 12C12 9 9.5 6.5 6 6.5c0 3 2.5 5.5 6 5.5Z" />
    </svg>
  )
}

export function IconFeather(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4C13 4 8 9 8 16v3l-3 1" />
      <path d="M20 4c0 7-5 12-12 12" />
      <path d="M14 7 9 12M17 9l-4 4" />
    </svg>
  )
}

export function IconSparkles(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
      <path d="M19 14l.7 1.8L21.5 16.5 19.7 17.2 19 19l-.7-1.8L16.5 16.5 18.3 15.8 19 14Z" />
    </svg>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

export function IconLogout(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 12H4M9 8l-4 4 4 4" />
      <path d="M9 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9" />
    </svg>
  )
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconLeaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-8 6-13 14-14 1 9-4 15-14 14Z" />
      <path d="M5 19c3-5 6-7 10-9" />
    </svg>
  )
}
