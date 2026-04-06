import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'neutral'
  className?: string
}

const variants = {
  success: 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent',
  warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400',
  error:   'bg-red-500/10 border border-red-500/30 text-red-400',
  neutral: 'bg-white/5 border border-white/10 text-text-muted',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
