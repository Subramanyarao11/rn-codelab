'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
import { WORKSPACE_TOUR_STEPS, type TourStep } from '@/lib/onboarding'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/cn'

const CARD_WIDTH = 300
const CARD_ESTIMATE_HEIGHT = 200
const PAD = 8
const GAP = 16
const VIEWPORT_MARGIN = 16
const SIDEBAR_WIDTH = 220
const TOOLBAR_PAD = 6
const ARROW_SIZE = 8

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

type ArrowDir = 'up' | 'down' | 'left' | 'right'

interface StepLayout {
  spotlight: Rect
  card: { top: number; left: number }
  arrow: { top: number; left: number; dir: ArrowDir }
}

interface WorkspaceTourProps {
  open: boolean
  onComplete: () => void
  onSkip: () => void
}

function domRect(el: Element): DOMRect {
  return el.getBoundingClientRect()
}

/** Tight bounds around visible children (fixes flex row clipping on last button). */
function unionRect(container: Element): DOMRect {
  const fallback = container.getBoundingClientRect()
  const kids = Array.from(container.children)
  if (kids.length === 0) return fallback

  let top = Infinity
  let left = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const child of kids) {
    const r = child.getBoundingClientRect()
    if (r.width < 1 && r.height < 1) continue
    top = Math.min(top, r.top)
    left = Math.min(left, r.left)
    right = Math.max(right, r.right)
    bottom = Math.max(bottom, r.bottom)
  }

  if (!Number.isFinite(top)) return fallback
  return new DOMRect(left, top, right - left, bottom - top)
}

function rectFromDom(r: DOMRect, pad = PAD): Rect {
  return {
    top: r.top - pad,
    left: r.left - pad,
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  }
}

function toSpotlight(r: DOMRect, maxHeight?: number): Rect {
  const height = maxHeight != null ? Math.min(r.height, maxHeight) : r.height
  return {
    top: Math.max(VIEWPORT_MARGIN, r.top - PAD),
    left: Math.max(VIEWPORT_MARGIN, r.left - PAD),
    width: r.width + PAD * 2,
    height: height + PAD * 2,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function clampCard(top: number, left: number, cardW: number, cardH: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    top: clamp(top, VIEWPORT_MARGIN, vh - cardH - VIEWPORT_MARGIN),
    left: clamp(left, VIEWPORT_MARGIN, vw - cardW - VIEWPORT_MARGIN),
  }
}

/** Per-step layout: spotlight cutout + card anchored to real UI chrome */
function computeStepLayout(step: TourStep, cardW: number, cardH: number): StepLayout | null {
  if (step.id === 'sidebar') {
    const aside = document.querySelector('[data-tour="sidebar"]')
    const challenges = document.querySelector('[data-tour="sidebar-challenges"]')
    if (!challenges) return null

    const nav = domRect(challenges)
    const asideRight = aside ? domRect(aside).right : SIDEBAR_WIDTH

    const spotlight = toSpotlight(nav, 300)
    const cardTop = nav.top + 6
    const cardLeft = asideRight + GAP
    const card = clampCard(cardTop, cardLeft, cardW, cardH)

    return {
      spotlight,
      card,
      arrow: {
        top: nav.top + 32,
        left: card.left - 10,
        dir: 'left',
      },
    }
  }

  if (step.id === 'toolbar') {
    const actions = document.querySelector('[data-tour="toolbar-actions"]')
    if (!actions) return null

    const r = unionRect(actions)
    const centerX = r.left + r.width / 2
    const spotlight = rectFromDom(r, TOOLBAR_PAD)
    const cardTop = r.bottom + TOOLBAR_PAD + ARROW_SIZE + GAP
    const card = clampCard(cardTop, centerX - cardW / 2, cardW, cardH)

    return {
      spotlight,
      card,
      arrow: {
        top: r.bottom + TOOLBAR_PAD - 2,
        left: centerX - ARROW_SIZE,
        dir: 'down',
      },
    }
  }

  const el = document.querySelector(step.target)
  if (!el) return null

  const r = domRect(el)
  const spotlight = toSpotlight(r)
  const align = step.align ?? 'center'

  let cardTop = r.top
  let cardLeft = r.left

  switch (step.placement) {
    case 'right':
      cardLeft = r.right + GAP
      cardTop =
        align === 'start'
          ? r.top
          : align === 'end'
            ? r.bottom - cardH
            : r.top + r.height / 2 - cardH / 2
      break
    case 'left':
      cardLeft = r.left - GAP - cardW
      cardTop =
        align === 'start'
          ? r.top
          : align === 'end'
            ? r.bottom - cardH
            : r.top + r.height / 2 - cardH / 2
      break
    case 'top':
      cardTop = r.top - GAP - cardH
      cardLeft =
        align === 'end'
          ? r.right - cardW
          : align === 'start'
            ? r.left
            : r.left + r.width / 2 - cardW / 2
      break
    case 'bottom':
      cardTop = r.bottom + GAP
      cardLeft =
        align === 'end'
          ? r.right - cardW
          : align === 'start'
            ? r.left
            : r.left + r.width / 2 - cardW / 2
      break
  }

  const card = clampCard(cardTop, cardLeft, cardW, cardH)

  const arrow: StepLayout['arrow'] =
    step.placement === 'right'
      ? { top: card.top + cardH / 2 - 8, left: r.right + GAP - 8, dir: 'right' }
      : step.placement === 'left'
        ? { top: card.top + cardH / 2 - 8, left: card.left + cardW, dir: 'left' }
        : step.placement === 'bottom'
          ? { top: r.bottom + GAP - 8, left: card.left + cardW / 2 - 8, dir: 'down' }
          : { top: card.top + cardH, left: card.left + cardW / 2 - 8, dir: 'up' }

  return { spotlight, card, arrow }
}

function SpotlightMask({ rect }: { rect: Rect }) {
  const { top, left, width, height } = rect
  const shade = 'fixed z-[1201] bg-app-overlay backdrop-blur-[1px]'

  return (
    <>
      <div className={shade} style={{ top: 0, left: 0, right: 0, height: top }} aria-hidden />
      <div
        className={shade}
        style={{ top: top + height, left: 0, right: 0, bottom: 0 }}
        aria-hidden
      />
      <div className={shade} style={{ top, left: 0, width: left, height }} aria-hidden />
      <div
        className={shade}
        style={{ top, left: left + width, right: 0, height }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed z-[1202] rounded-lg border-2 border-amber-400/95 bg-amber-400/[0.06] shadow-[0_0_0_1px_rgba(245,158,11,0.4),0_0_28px_rgba(245,158,11,0.25)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ top, left, width, height }}
        aria-hidden
      />
    </>
  )
}

function TourArrow({ top, left, dir }: { top: number; left: number; dir: ArrowDir }) {
  const size = 8
  const border = 'var(--app-tour-arrow)'
  const styles: Record<ArrowDir, React.CSSProperties> = {
    down: {
      borderWidth: `0 ${size}px ${size}px ${size}px`,
      borderColor: `transparent transparent ${border} transparent`,
    },
    up: {
      borderWidth: `${size}px ${size}px 0 ${size}px`,
      borderColor: `${border} transparent transparent transparent`,
    },
    left: {
      borderWidth: `${size}px ${size}px ${size}px 0`,
      borderColor: `transparent ${border} transparent transparent`,
    },
    right: {
      borderWidth: `${size}px 0 ${size}px ${size}px`,
      borderColor: `transparent transparent transparent ${border}`,
    },
  }

  return (
    <span
      className="pointer-events-none fixed z-[1203] h-0 w-0 border-solid"
      style={{ top, left, ...styles[dir] }}
      aria-hidden
    />
  )
}

export function WorkspaceTour({ open, onComplete, onSkip }: WorkspaceTourProps) {
  const [mounted, setMounted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [layout, setLayout] = useState<StepLayout | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = useState({ w: CARD_WIDTH, h: CARD_ESTIMATE_HEIGHT })

  const step = WORKSPACE_TOUR_STEPS[stepIndex]
  const isLast = stepIndex === WORKSPACE_TOUR_STEPS.length - 1

  const remeasure = useCallback(() => {
    if (!step) return
    const next = computeStepLayout(step, cardSize.w, cardSize.h)
    if (next) setLayout(next)
  }, [step, cardSize.w, cardSize.h])

  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    if (!open || !step) return
    setCardSize({ w: CARD_WIDTH, h: CARD_ESTIMATE_HEIGHT })
    setLayout(null)

    let attempts = 0
    let raf = 0

    const tryMeasure = () => {
      const next = computeStepLayout(step, CARD_WIDTH, CARD_ESTIMATE_HEIGHT)
      if (next) setLayout(next)
      attempts += 1
      if (!next && attempts < 12) {
        raf = requestAnimationFrame(tryMeasure)
      }
    }

    raf = requestAnimationFrame(tryMeasure)
    return () => cancelAnimationFrame(raf)
  }, [open, stepIndex, step])

  useLayoutEffect(() => {
    if (!open || !cardRef.current) return
    const { width, height } = cardRef.current.getBoundingClientRect()
    if (width > 0 && height > 0) {
      setCardSize({ w: width, h: height })
    }
  }, [open, stepIndex, layout?.spotlight.top])

  useLayoutEffect(() => {
    remeasure()
  }, [cardSize.w, cardSize.h, remeasure])

  useEffect(() => {
    if (!open) return
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [open, remeasure])

  useEffect(() => {
    if (!open) {
      setStepIndex(0)
      setLayout(null)
    }
  }, [open])

  const handleNext = () => {
    if (isLast) {
      analytics.tourCompleted(WORKSPACE_TOUR_STEPS.length)
      onComplete()
      return
    }
    setStepIndex((i) => i + 1)
  }

  const handleSkip = () => {
    analytics.tourSkipped(stepIndex + 1, WORKSPACE_TOUR_STEPS.length)
    onSkip()
  }

  const handleBack = () => setStepIndex((i) => Math.max(0, i - 1))

  if (!mounted || !open || !step) return null

  const cardPos = layout?.card ?? { top: VIEWPORT_MARGIN, left: VIEWPORT_MARGIN }

  const content = (
    <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal aria-label="Workspace tour">
      {layout ? (
        <SpotlightMask rect={layout.spotlight} />
      ) : (
        <div className="fixed inset-0 z-[1201] bg-app-overlay" aria-hidden />
      )}

      {layout && (
        <TourArrow top={layout.arrow.top} left={layout.arrow.left} dir={layout.arrow.dir} />
      )}

      <AnimatePresence mode="wait">
        <div
          key={step.id}
          className="fixed z-[1204]"
          style={{
            top: cardPos.top,
            left: cardPos.left,
            width: CARD_WIDTH,
          }}
        >
          <motion.div
            ref={cardRef}
            className={cn(
              'relative w-full rounded-xl border border-app-input-border bg-app-tour-card p-4 shadow-tour-card'
            )}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={handleSkip}
              className="absolute right-2 top-2 rounded-md p-1 text-app-fg-subtle transition-colors hover:bg-app-hover hover:text-app-fg-secondary"
              aria-label="Close tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="mb-2 flex items-center gap-2 pr-6 text-amber-400">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-fg-subtle">
                Step {stepIndex + 1} of {WORKSPACE_TOUR_STEPS.length}
              </span>
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-app-fg">{step.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-app-fg-muted">{step.body}</p>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-app-fg-subtle transition-colors hover:text-app-fg-secondary"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-1.5">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex h-7 items-center gap-0.5 rounded bg-app-control px-2 text-xs text-app-fg-secondary hover:bg-app-control-hover"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-7 items-center gap-0.5 rounded bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-400"
                >
                  {isLast ? 'Get started' : 'Next'}
                  {!isLast && <ChevronRight className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  )

  return createPortal(content, document.body)
}
