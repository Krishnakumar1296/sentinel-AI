import { cn } from '../../utils/cn'

export function ConfidenceScore({
  value,
  size = 'md',
  label,
}: {
  value: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const radius = size === 'lg' ? 54 : size === 'md' ? 42 : 30
  const stroke = size === 'lg' ? 10 : size === 'md' ? 8 : 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 90 ? '#16A34A' : value >= 75 ? '#2563EB' : '#F59E0B'

  const dims = size === 'lg' ? 130 : size === 'md' ? 100 : 72

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle cx={dims / 2} cy={dims / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-ink', size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm')}>
            {value}%
          </span>
        </div>
      </div>
      {label && <p className="mt-2 text-center text-sm font-medium text-muted">{label}</p>}
    </div>
  )
}
