"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Seconds that must be downloaded ahead of the playhead before playback (re)starts. */
const AHEAD = 10
/** If less than this is left in the buffer while playing, stop and buffer instead of stuttering. */
const LOW = 1

/** Seconds downloaded ahead of the playhead, and whether everything is in. */
function buffer(v: HTMLVideoElement) {
  const d = v.duration
  if (!Number.isFinite(d) || d <= 0) return { ahead: 0, full: false, target: AHEAD }
  let end = 0
  for (let i = 0; i < v.buffered.length; i++) {
    if (v.buffered.start(i) <= v.currentTime + 0.1) end = Math.max(end, v.buffered.end(i))
  }
  const left = d - v.currentTime
  return { ahead: Math.max(0, end - v.currentTime), full: end >= d - 0.25, target: Math.min(AHEAD, left) }
}

function ready(v: HTMLVideoElement) {
  const b = buffer(v)
  return b.full || (v.readyState >= 3 && b.ahead >= b.target)
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label ?? "Loading"} className={cn("relative grid size-14 place-items-center", className)}>
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/15 border-t-white" />
      {label && <span className="font-mono text-[11px] text-white/80 tabular-nums">{label}</span>}
    </span>
  )
}

/**
 * Full video with sound, played from the original file. It never plays choppy: a spinner with
 * the download progress shows until enough is buffered, and it pauses to buffer again (rather
 * than stutter) if the connection falls behind. A pause by the viewer stays a pause.
 */
export function Player({ src, poster }: { src: string; poster: string }) {
  const ref = React.useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = React.useState(true)
  const [started, setStarted] = React.useState(false)
  const [pct, setPct] = React.useState(0)
  // true while *we* hold playback to buffer, so it resumes on its own
  const holding = React.useRef(true)

  React.useEffect(() => {
    const v = ref.current
    if (!v) return
    const check = () => {
      const b = buffer(v)
      setPct(b.full ? 100 : Math.min(99, Math.round((b.ahead / Math.max(b.target, 0.1)) * 100)))
      if (holding.current && ready(v)) {
        holding.current = false
        setLoading(false)
        setStarted(true)
        v.play().catch(() => {})
      }
    }
    const hold = () => {
      const b = buffer(v)
      if (v.paused || b.full || b.ahead >= LOW) return
      holding.current = true
      setLoading(true)
      v.pause()
    }
    const onWaiting = () => {
      if (!buffer(v).full) {
        holding.current = true
        setLoading(true)
        v.pause()
      }
    }
    const events = ["progress", "canplay", "canplaythrough", "loadedmetadata", "seeked"] as const
    events.forEach((ev) => v.addEventListener(ev, check))
    v.addEventListener("timeupdate", hold)
    v.addEventListener("waiting", onWaiting)
    check()
    return () => {
      events.forEach((ev) => v.removeEventListener(ev, check))
      v.removeEventListener("timeupdate", hold)
      v.removeEventListener("waiting", onWaiting)
    }
  }, [])

  return (
    <div className="relative">
      <video ref={ref} src={src} poster={poster} preload="auto" controls={started} playsInline className="aspect-video w-full" />
      {loading && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35">
          <Spinner label={`${pct}%`} />
        </span>
      )}
    </div>
  )
}
