import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div role="dialog" aria-modal="true" className="surface-card-strong w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5">
          <div>
            <p className="page-kicker mb-1">Dialog</p>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/70 bg-white/80 text-slate-500 transition hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-sm" aria-label="Close dialog">
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}