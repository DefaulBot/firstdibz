'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition will-change-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' &&
          'bg-[#0f2f63] text-white hover:bg-[#0b2550] shadow-soft',
        variant === 'secondary' &&
          'bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft',
        variant === 'ghost' &&
          'bg-transparent text-zinc-700 hover:bg-zinc-100',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-sm',
        size === 'lg' && 'h-12 px-5 text-base',
        className,
      )}
      {...props}
    />
  )
}
