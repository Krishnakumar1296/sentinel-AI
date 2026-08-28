export function SkeletonLoader({ variant = 'default' }: { variant?: string }) {
  switch (variant) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-4 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      )
    case 'answer':
      return (
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="skeleton h-10 w-72" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-10/12" />
          </div>
          <div className="flex gap-4">
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-24 w-full" />
          </div>
        </div>
      )
    case 'library':
      return (
        <div className="space-y-4">
          <div className="skeleton h-10 w-56" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-14 w-full rounded-xl" />)}
          </div>
        </div>
      )
    case 'analytics':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
            <div className="skeleton h-72 rounded-2xl" />
          </div>
        </div>
      )
    case 'evidence':
      return (
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-96 w-full rounded-xl" />
        </div>
      )
    default:
      return (
        <div className="space-y-3">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-96 max-w-full" />
          <div className="skeleton h-48 w-full rounded-2xl" />
        </div>
      )
  }
}
