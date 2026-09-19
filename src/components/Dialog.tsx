import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { PiXLight } from 'react-icons/pi'

interface DialogProps { open: boolean; onClose: () => void; title: string; children: ReactNode }

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])

  return (
    <dialog ref={ref} onCancel={onClose} onClick={event => {
      if (event.target !== event.currentTarget) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}
      aria-label={title} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-white/15 bg-canvas p-7 text-ink shadow-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-ink">
          <PiXLight size={22} />
        </button>
      </div>
      {children}
    </dialog>
  )
}
