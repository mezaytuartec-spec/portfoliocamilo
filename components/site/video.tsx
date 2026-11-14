"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Muted preview that only plays when it can play smoothly:
 * - starts buffering a little before it scrolls into view,
 * - waits for `canplaythrough` before playing (no stuttery start),
 * - pauses when it leaves the screen or while the full player is open.
 */
export function usePreview(
  ref: React.RefObject<HTMLVideoElement | null>,
  { src, enabled, paused }: { src: string; enabled: boolean; paused: boolean },
) {
  const state = React.useRef({ visible: false, paused })

  const tryPlay = React.useCallback(() => {
    const v = ref.current
    const s = state.current
    if (v && s.visible && !s.paused && v.readyState >= 4) v.play().catch(() => {})
  }, [ref])

  React.useEffect(() => {
    const v = ref.current
    if (!v || !enabled) return
    const io = new IntersectionObserver(
      ([e]) => {
        state.current.visible = e.isIntersecting
        if (!e.isIntersecting) return v.pause()
        if (v.preload !== "auto") {
          v.preload = "auto"
          v.load()
        }
        tryPlay()
      },
      { rootMargin: "300px 0px" },
    )
    io.observe(v)
    v.addEventListener("canplaythrough", tryPlay)
    return () => {
      io.disconnect()
      v.removeEventListener("canplaythrough", tryPlay)
    }
  }, [ref, src, enabled, tryPlay])

  React.useEffect(() => {
    state.current.paused = paused
    if (paused) ref.current?.pause()
    else tryPlay()
  }, [paused, ref, tryPlay])
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("block size-10 animate-spin rounded-full border-2 border-white/20 border-t-white", className)}
    />
  )
}

/**
 * Full video with sound. It never plays choppy: it shows a spinner until the browser
 * says it can play through, and again whenever it runs out of buffer.
 */
export function Player({ src, poster }: { src: string; poster: string }) {
  const [loading, setLoading] = React.useState(true)
  const [started, setStarted] = React.useState(false)
  // true while *we* paused it to buffer, so it resumes on its own; a user pause stays paused
  const resume = React.useRef(true)

  return (
    <div className="relative">
      <video
        src={src}
        poster={poster}
        preload="auto"
        controls={started}
        playsInline
        className="aspect-video w-full"
        onCanPlayThrough={(e) => {
          setLoading(false)
          if (resume.current) {
            resume.current = false
            setStarted(true)
            e.currentTarget.play().catch(() => {})
          }
        }}
        onWaiting={(e) => {
          // out of buffer: hold still on a spinner instead of crawling forward
          setLoading(true)
          resume.current = true
          e.currentTarget.pause()
        }}
        onPlaying={() => setLoading(false)}
      />
      {loading && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30">
          <Spinner />
        </span>
      )}
    </div>
  )
}
