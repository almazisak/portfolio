import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CardStack.css'

/**
 * Figma-derived card sizes & vertical offsets.
 * yOffset = distance card CENTER sits above the container's 50% line (px, negative = up).
 * Derived from: top: calc(50% - Y) with -translate-y-1/2 centering.
 */
const DEPTH = [
  { w: 392, h: 335, yOffset: -41.5 },  // depth 0 — front
  { w: 352, h: 302, yOffset: -78 },
  { w: 304, h: 261, yOffset: -114.5 },
  { w: 268, h: 228, yOffset: -151 },
  { w: 238, h: 204, yOffset: -187.5 }, // depth 4 — back
]

const SIDE_MARGIN   = 24   // px each side
const MIN_CARD_W    = 342  // px — minimum front card width
const MAX_CARD_W    = 450  // px — maximum front card width
const SWIPE_THRESH  = 72   // px
const SWIPE_VEL     = 0.35 // px/ms

// At scale 1.0, the visual extent of the full stack:
//   top  = back card top  = |yOffset[4]| + h[4]/2 = 187.5 + 102    = 289.5 px above center
//   bottom = front card bottom = yOffset[0] + h[0]/2 = -41.5 + 167.5 = 126   px below center
const STACK_TOP_HALF    = (-DEPTH[DEPTH.length - 1].yOffset) + DEPTH[DEPTH.length - 1].h / 2  // 289.5
const STACK_BOTTOM_HALF = DEPTH[0].yOffset + DEPTH[0].h / 2                                    // 126
const STACK_VISUAL_H    = STACK_TOP_HALF + STACK_BOTTOM_HALF                                   // 415.5

// Shift all cards down so the stack is visually centered in its container.
// Without this, all yOffsets are negative (all cards above center) leaving dead space below.
const STACK_CENTER_SHIFT = (STACK_TOP_HALF - STACK_BOTTOM_HALF) / 2  // 81.75

const WIDGET_AREA = 160 // px — widget height (136) + bottom offset (24)

function computeScale(vw) {
  const scaleByW = Math.min(MAX_CARD_W / DEPTH[0].w, (vw - SIDE_MARGIN * 2) / DEPTH[0].w)
  const scaleByH = (window.innerHeight - WIDGET_AREA) / STACK_VISUAL_H
  return Math.min(scaleByW, scaleByH)
}

const CARDS = [
  { id: 'case-study-01', label: 'Case Study 01' },
  { id: 'case-study-02', label: 'Case Study 02' },
  { id: 'case-study-03', label: 'Case Study 03' },
  { id: 'case-study-04', label: 'Case Study 04' },
  { id: 'case-study-05', label: 'Case Study 05' },
]

export default function CardStack() {
  const [order, setOrder]   = useState(CARDS.map((c) => c.id))
  const [drag, setDrag]     = useState({ active: false, x: 0, startX: 0, startTime: 0 })
  const [flyOff, setFlyOff] = useState(null)   // 'left' | 'right' | null
  const wasDragging = useRef(false)
  const navigate = useNavigate()

  const [scale, setScale] = useState(() => computeScale(window.innerWidth))

  useEffect(() => {
    function onResize() { setScale(computeScale(window.innerWidth)) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cardById = (id) => CARDS.find((c) => c.id === id)

  // ── Pointer handlers ────────────────────────────────────────────────
  function onPointerDown(e) {
    if (flyOff) return
    e.currentTarget.setPointerCapture(e.pointerId)
    wasDragging.current = false
    setDrag({ active: true, x: 0, startX: e.clientX, startTime: Date.now() })
  }

  function onPointerMove(e) {
    if (!drag.active || flyOff) return
    const dx = e.clientX - drag.startX
    if (Math.abs(dx) > 5) wasDragging.current = true
    setDrag((d) => ({ ...d, x: dx }))
  }

  function onPointerUp() {
    if (!drag.active) return
    const dx  = drag.x
    const dt  = Math.max(1, Date.now() - drag.startTime)
    const vel = Math.abs(dx) / dt
    const pass = Math.abs(dx) > SWIPE_THRESH || vel > SWIPE_VEL

    if (pass) {
      const dir = dx > 0 ? 'right' : 'left'
      setFlyOff(dir)
      setTimeout(() => {
        setOrder((prev) => { const n = [...prev]; n.push(n.shift()); return n })
        setFlyOff(null)
        setDrag({ active: false, x: 0, startX: 0, startTime: 0 })
      }, 380)
    } else {
      if (!wasDragging.current) navigate(`/case-study/${order[0]}`)
      setDrag({ active: false, x: 0, startX: 0, startTime: 0 })
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  // Container matches the exact visual span of the stack; cards are shifted so
  // the stack is visually centred (equal space above back card and below front card).
  const stackHeight = STACK_VISUAL_H * scale

  return (
    <div className="card-stack" style={{ height: stackHeight }}>
      {[...order].reverse().map((id, revIdx) => {
        const depthIdx = order.length - 1 - revIdx  // 0 = front
        const isTop    = depthIdx === 0
        const d        = DEPTH[depthIdx] || DEPTH[DEPTH.length - 1]

        const w = d.w * scale
        const h = d.h * scale
        // STACK_CENTER_SHIFT re-centres the stack so the visual span fills the container evenly
        const yOff = (d.yOffset + STACK_CENTER_SHIFT) * scale

        // Base: center the card at (50%, 50% + yOff)
        let dx = 0
        let rotate = 0
        let extraTransition = ''

        if (isTop) {
          if (flyOff) {
            dx = flyOff === 'right' ? window.innerWidth * 1.3 : -window.innerWidth * 1.3
            rotate = flyOff === 'right' ? 20 : -20
          } else if (drag.active) {
            dx = drag.x
            rotate = drag.x * 0.055
          }
        }

        const transform = [
          `translateX(calc(-50% + ${dx}px))`,
          `translateY(calc(-50% + ${yOff}px))`,
          rotate !== 0 ? `rotate(${rotate}deg)` : '',
        ].filter(Boolean).join(' ')

        let transition = 'transform 0.3s cubic-bezier(0.34,1.4,0.64,1)'
        if (isTop) {
          if (flyOff)            transition = 'transform 0.36s cubic-bezier(0.4,0,1,1)'
          else if (drag.active)  transition = 'none'
        }

        return (
          <div
            key={id}
            className={`card-item${isTop ? ' card-top' : ''}`}
            style={{
              width:  w,
              height: h,
              transform,
              transition,
              zIndex:  order.length - depthIdx,
              opacity: depthIdx < 4 ? 1 : 0,
            }}
            {...(isTop ? {
              onPointerDown,
              onPointerMove,
              onPointerUp,
              onPointerCancel: onPointerUp,
            } : {})}
          >
            <div className="card-face">
              <span className="card-label">{cardById(id)?.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
