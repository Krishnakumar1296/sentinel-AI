export interface CamGoal {
  x: number
  y: number
  z: number
  tx: number
  ty: number
  tz: number
}

// Mutable values scrubbed by GSAP ScrollTrigger and read every frame by
// the React Three Fiber canvas. 0 = dark navy, 1 = light mode.
export const landingStore = {
  theme: 0, // background + lighting crossfade
  hero: 0, // nanotech assembly progress 0 → 1
  shatter: 0, // hero motor shatter 0 → 1 (drives dark → light)
  vessel: 0, // sticky hub interaction progress 0..1
  ribbons: 0, // data-flow ribbons reveal 0 → 1
  camera: { x: 0, y: 0.4, z: 9.5, tx: -0.2, ty: 0.2, tz: 0 } as CamGoal,
}

export const DARK = '#0B1120'
export const LIGHT = '#F8FAFC'

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

export const smooth01 = (t: number) => {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}