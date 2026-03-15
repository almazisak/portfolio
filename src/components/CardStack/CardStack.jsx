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

const SIDE_MARGIN   = 24  // px each side
const SWIPE_THRESH  = 72  // px
const SWIPE_VEL     = 0.35 // px/ms

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

  // Responsive scale: keep front card within [SIDE_MARGIN, vw - SIDE_MARGIN]
  const [scale, setScale] = useState(() => {
    const avail = window.innerWidth - SIDE_MARGIN * 2
    return Math.min(1, avail / DEPTH[0].w)
  })

  useEffect(() => {
    function onResize() {
      const avail = window.innerWidth - SIDE_MARGIN * 2
      setScale(Math.min(1, avail / DEPTH[0].w))
    }
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
  return (
    <div className="card-stack">
      {[...order].reverse().map((id, revIdx) => {
        const depthIdx = order.length - 1 - revIdx  // 0 = front
        const isTop    = depthIdx === 0
        const d        = DEPTH[depthIdx] || DEPTH[DEPTH.length - 1]

        const w = d.w * scale
        const h = d.h * scale
        const yOff = d.yOffset * scale  // scale vertical spacing proportionally

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
