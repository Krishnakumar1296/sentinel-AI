export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-canvas" aria-hidden="true">
      {/* Top Center Diffused Spotlight — Animate UI signature glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full blur-[140px] opacity-30 dark:opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(200, 220, 255, 0.15) 35%, transparent 70%)',
        }}
      />

      {/* Subtle secondary ambient glows */}
      <div className="absolute -top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] dark:bg-sky-400/[0.03] blur-[140px]" />
      <div className="absolute top-1/2 -left-40 h-[450px] w-[450px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-400/[0.02] blur-[150px]" />

      {/* Masked Micro-Dot Grid Matrix */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, #000 30%, transparent 85%)',
        }}
      />
    </div>
  )
}


