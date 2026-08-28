import {
  Building2,
  FileText,
  BarChart3,
  Briefcase,
  ShieldCheck,
  Users,
  Search,
  Database,
  Landmark,
  Presentation,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FloatItem {
  Icon: LucideIcon
  top: string
  left: string
  size: string
  duration: string
  delay: string
  opacity: string
  direction: 'ltr' | 'rtl'
}

const items: FloatItem[] = [
  { Icon: Building2, top: '12%', left: '4%', size: 'h-14 w-14', duration: '46s', delay: '0s', opacity: 'opacity-15', direction: 'ltr' },
  { Icon: FileText, top: '22%', left: '72%', size: 'h-10 w-10', duration: '38s', delay: '-6s', opacity: 'opacity-20', direction: 'rtl' },
  { Icon: BarChart3, top: '58%', left: '10%', size: 'h-12 w-12', duration: '52s', delay: '-12s', opacity: 'opacity-15', direction: 'rtl' },
  { Icon: Briefcase, top: '70%', left: '70%', size: 'h-12 w-12', duration: '44s', delay: '-18s', opacity: 'opacity-20', direction: 'ltr' },
  { Icon: ShieldCheck, top: '34%', left: '42%', size: 'h-16 w-16', duration: '60s', delay: '-9s', opacity: 'opacity-10', direction: 'ltr' },
  { Icon: Users, top: '80%', left: '36%', size: 'h-10 w-10', duration: '40s', delay: '-22s', opacity: 'opacity-15', direction: 'rtl' },
  { Icon: Search, top: '48%', left: '86%', size: 'h-9 w-9', duration: '50s', delay: '-3s', opacity: 'opacity-15', direction: 'ltr' },
  { Icon: Database, top: '8%', left: '58%', size: 'h-11 w-11', duration: '55s', delay: '-15s', opacity: 'opacity-15', direction: 'rtl' },
  { Icon: Landmark, top: '64%', left: '24%', size: 'h-[3.25rem] w-[3.25rem]', duration: '48s', delay: '-27s', opacity: 'opacity-10', direction: 'ltr' },
  { Icon: Presentation, top: '18%', left: '88%', size: 'h-11 w-11', duration: '42s', delay: '-20s', opacity: 'opacity-15', direction: 'rtl' },
]

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {items.map((it, i) => (
        <div
          key={i}
          className={`bg-anim-float-${it.direction} absolute ${it.size} ${it.opacity} text-brand-blue`
            .trim()}
          style={{
            top: it.top,
            left: it.left,
            animationDuration: it.duration,
            animationDelay: it.delay,
            transform: 'translateX(-50%)',
          }}
        >
          <it.Icon className="h-full w-full" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/30 dark:to-surface/40" />
    </div>
  )
}
