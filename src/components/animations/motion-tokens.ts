/**
 * Animate UI & Motion Design Tokens
 * Consistent durations, easings, and spring configurations.
 */

export const DURATION = {
  FAST: 0.2,
  NORMAL: 0.35,
  SLOW: 0.55,
  PAGE: 0.4,
} as const

export const EASING = {
  // Smooth natural cubic bezier for UI elements
  SMOOTH: [0.16, 1, 0.3, 1] as const,
  // Gentle ease out
  EASE_OUT: [0.25, 0.8, 0.25, 1] as const,
  // Snappy for interactive elements (buttons, menus)
  SNAPPY: [0.4, 0, 0.2, 1] as const,
  // Spring config for tactile feel
  SPRING: {
    type: 'spring',
    damping: 26,
    stiffness: 320,
    mass: 0.8,
  } as const,
  // Soft spring for modals & cards
  SOFT_SPRING: {
    type: 'spring',
    damping: 28,
    stiffness: 220,
    mass: 1,
  } as const,
} as const

export const TRANSITION = {
  fadeUp: {
    duration: DURATION.NORMAL,
    ease: EASING.SMOOTH,
  },
  scaleIn: {
    duration: DURATION.NORMAL,
    ease: EASING.SMOOTH,
  },
  hover: {
    duration: DURATION.FAST,
    ease: EASING.EASE_OUT,
  },
  tap: {
    duration: 0.1,
    ease: EASING.SNAPPY,
  },
} as const
