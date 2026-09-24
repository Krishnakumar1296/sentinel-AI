import React, { useEffect, useRef } from 'react'

interface GravityStarsBackgroundProps {
  children?: React.ReactNode
  className?: string
  starCount?: number
  speed?: number
  starColor?: string
  connectionRadius?: number
}

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
}

export function GravityStarsBackground({
  children,
  className = '',
  starCount = 70,
  speed = 0.5,
  starColor = '#3b82f6',
  connectionRadius = 110,
}: GravityStarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }

    window.addEventListener('resize', handleResize)

    // Generate stars
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      baseOpacity: Math.random() * 0.5 + 0.2,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Mouse gravity interaction
        if (mouse.active) {
          const dx = mouse.x - star.x
          const dy = mouse.y - star.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 180

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.08
            star.vx += (dx / dist) * force
            star.vy += (dy / dist) * force
            star.opacity = Math.min(1, star.baseOpacity + (1 - dist / maxDist) * 0.8)
          } else {
            star.opacity = star.baseOpacity
          }
        }

        // Apply friction to prevent infinite acceleration
        star.vx *= 0.98
        star.vy *= 0.98

        // Maintain minimum float speed
        if (Math.abs(star.vx) < 0.1) star.vx += (Math.random() - 0.5) * 0.1
        if (Math.abs(star.vy) < 0.1) star.vy += (Math.random() - 0.5) * 0.1

        star.x += star.vx
        star.y += star.vy

        // Wrap around boundaries
        if (star.x < 0) star.x = width
        if (star.x > width) star.x = 0
        if (star.y < 0) star.y = height
        if (star.y > height) star.y = 0

        // Draw star with glow
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = starColor
        ctx.globalAlpha = star.opacity
        ctx.shadowBlur = 8
        ctx.shadowColor = starColor
        ctx.fill()
        ctx.shadowBlur = 0

        // Connect nearby stars with subtle luminous web
        for (let j = i + 1; j < stars.length; j++) {
          const star2 = stars[j]
          const distStar = Math.hypot(star.x - star2.x, star.y - star2.y)

          if (distStar < connectionRadius) {
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(star2.x, star2.y)
            const connAlpha = (1 - distStar / connectionRadius) * 0.22
            ctx.strokeStyle = starColor
            ctx.globalAlpha = connAlpha
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }

    const handlePointerLeave = () => {
      mouseRef.current.active = false
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handlePointerMove)
      parent.addEventListener('mouseleave', handlePointerLeave)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (parent) {
        parent.removeEventListener('mousemove', handlePointerMove)
        parent.removeEventListener('mouseleave', handlePointerLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [starCount, speed, starColor, connectionRadius])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children}
    </div>
  )
}

export default GravityStarsBackground
