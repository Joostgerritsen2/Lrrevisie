import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-primary border-2 border-brand-accent text-white hover:bg-brand-accent font-bold tracking-wide',
  ghost:   'bg-transparent border-2 border-white/25 text-white/85 hover:border-white/50 font-bold tracking-wide',
  outline: 'bg-transparent border border-border text-text-muted hover:border-border-hover hover:text-white font-medium',
}

const sizes = {
  sm:  'px-4 py-2 text-xs',
  md:  'px-6 py-3 text-sm',
  lg:  'px-8 py-4 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, children, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        'inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
