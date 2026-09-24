export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Soft Ambient Horizon Lights (Natural, human-crafted atmospheric illumination) */}
      <div className="absolute -top-48 left-1/3 h-[580px] w-[580px] rounded-full bg-blue-600/[0.04] dark:bg-blue-500/[0.07] blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 h-[520px] w-[520px] rounded-full bg-indigo-600/[0.03] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-48 left-10 h-[500px] w-[500px] rounded-full bg-slate-500/[0.03] dark:bg-slate-700/[0.05] blur-[130px] pointer-events-none" />

      {/* Ultra-subtle micro-dot texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}

