'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-[#0f2f63] focus:ring-4 focus:ring-[#0f2f63]/10',
        className,
      )}
      {...props}
    />
  )
})
