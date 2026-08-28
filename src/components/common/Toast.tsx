import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

const ToastContext = createContext<{ toast: (type: ToastType, message: string) => void } | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-[#2563EB]" />,
  }

  const borders: Record<ToastType, string> = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg animate-fade-in ${borders[t.type]}`}
          >
            <span className="mt-0.5">{icons[t.type]}</span>
            <p className="text-sm text-[#172033]">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
