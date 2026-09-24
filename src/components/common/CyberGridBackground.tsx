import React from 'react'

export function CyberGridBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Soft Ambient Horizon Lights */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/[0.08] via-indigo-600/[0.04] to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-20 left-10 w-80 h-80 rounded-full bg-blue-500/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-10 w-96 h-96 rounded-full bg-indigo-600/[0.05] blur-[140px]" />

      {/* Ultra-subtle Micro-dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}


