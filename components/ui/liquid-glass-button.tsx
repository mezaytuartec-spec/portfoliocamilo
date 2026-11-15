"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const sizes = {
  sm: "h-8 gap-1.5 px-4 text-xs",
  lg: "h-10 px-6",
} as const

/** Liquid-glass pill button: a glass rim drawn with layered shadows (no live backdrop filter, so it costs nothing to scroll past). */
export function LiquidButton({
  className,
  size = "lg",
  children,
  ...props
}: React.ComponentProps<"button"> & { size?: keyof typeof sizes }) {
  return (
    <button
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap text-white outline-none transition duration-300 hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 z-0 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
      />
      <span className="pointer-events-none relative z-10">{children}</span>
    </button>
  )
}
