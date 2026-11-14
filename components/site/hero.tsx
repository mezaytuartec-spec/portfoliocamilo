"use client"

import * as React from "react"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { UI } from "@/lib/content"
import { useSite } from "./providers"
import { scrollToId } from "./nav"

export function Hero() {
  const { t } = useSite()

  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 md:pt-44">
      {/* ambient glow + dotted desk */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(70%_55%_at_50%_30%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute top-[-20%] left-1/2 -z-20 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,108,255,.20),transparent)] blur-2xl" />

      <div className="mx-auto max-w-5xl px-5 text-center">
        <div className="rise mx-auto inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-2 text-[12px] text-white/70 glass">
          <span className="relative flex size-2">
            <span className="pulse-dot size-2 rounded-full bg-[#3ddc84]" />
          </span>
          {t(UI.hero.available)}
        </div>

        <h1 className="rise font-display mt-7 text-[clamp(2rem,7.4vw,6.2rem)] leading-[0.98] font-medium" style={{ ["--d" as string]: "80ms" }}>
          <span className="text-white/45">{t(UI.hero.hello)}</span>
          <br />
          {t(UI.hero.titleA)}{" "}
          <span className="text-gradient pr-2 font-serif text-[1.08em] font-normal italic tracking-[-0.02em]">
            {t(UI.hero.titleEm)}
          </span>{" "}
          <br className="hidden md:block" />
          {t(UI.hero.titleB)}
        </h1>

        <p className="rise mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-lg" style={{ ["--d" as string]: "160ms" }}>
          {t(UI.hero.sub)}
        </p>

        <div className="rise mt-9 flex flex-wrap items-center justify-center gap-4" style={{ ["--d" as string]: "240ms" }}>
          <LiquidMetalButton label={t(UI.hero.ctaWork)} width={168} onClick={() => scrollToId("work")} />
          <LiquidButton size="lg" className="h-[46px] rounded-full px-7 text-white" onClick={() => scrollToId("contact")}>
            {t(UI.hero.ctaTalk)}
          </LiquidButton>
        </div>
      </div>

      {/* glowing horizon closing the hero */}
      <div aria-hidden className="relative mt-20 h-[200px] [clip-path:inset(-100vh_0_2px_0)] md:mt-28 md:h-[300px]">
        <div className="horizon -z-10 top-[70px] md:top-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[linear-gradient(to_bottom,transparent,#07070a_75%)]" />
      </div>

      <Marquee />
    </section>
  )
}

function Marquee() {
  const { lang } = useSite()
  const items = UI.marquee[lang]
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative mt-2 overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
      <div className="marquee flex w-max gap-10 font-mono text-[11px] tracking-[0.2em] text-white/35 uppercase">
        {row.map((s, k) => (
          <span key={k} className="flex items-center gap-10">
            {s}
            <span className="size-1 rounded-full bg-white/20" />
          </span>
        ))}
      </div>
    </div>
  )
}
