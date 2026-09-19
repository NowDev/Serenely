import { PiCheckLight } from 'react-icons/pi'
import type { Sound } from '../data/sounds'
import type { SoundStatus } from '../audio/SoundEngine'

interface SoundCardProps {
  sound: Sound
  level?: number
  status?: SoundStatus
  playing: boolean
  onToggle: () => void
  onVolume: (level: number) => void
  onRetry: () => void
}

export function SoundCard({ sound, level, status, playing, onToggle, onVolume, onRetry }: SoundCardProps) {
  const active = level !== undefined
  const Icon = sound.icon
  return (
    <article className={`group relative flex min-h-44 flex-col rounded-2xl border transition duration-200 ${active ? 'border-accent/25 bg-accent/10 text-accent' : 'border-transparent text-muted hover:bg-white/5 hover:text-ink'}`}>
      <button type="button" aria-pressed={active} aria-label={`${active ? 'Disable' : 'Enable'} ${sound.name}`}
        onClick={onToggle} className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl px-3 pt-6 pb-3">
        {active && <PiCheckLight aria-hidden="true" className="absolute top-3 right-3 text-accent" size={16} />}
        <Icon size={45} aria-hidden="true" className={`transition duration-200 ${active && playing ? 'opacity-100' : 'opacity-85'} group-hover:-translate-y-0.5 motion-reduce:transform-none`} />
        <span className="text-[0.9375rem] font-medium">{sound.name}</span>
      </button>
      <div className="flex h-10 items-center justify-center px-5 pb-3 sm:px-7">
        {active && status === 'error' ? (
          <button onClick={onRetry} className="rounded text-sm underline underline-offset-4">Could not load. Retry</button>
        ) : active && status === 'loading' ? (
          <span role="status" className="text-sm text-muted">Loading sound…</span>
        ) : (
          <input type="range" min="0" max="100" step="1" disabled={!active} value={Math.round((level ?? 0.5) * 100)}
            aria-label={`${sound.name} volume`} aria-valuetext={`${Math.round((level ?? 0.5) * 100)} percent`}
            onChange={event => onVolume(Number(event.target.value) / 100)}
            className={`h-4 w-full max-w-28 transition ${active ? 'opacity-100' : 'invisible'}`} />
        )}
      </div>
    </article>
  )
}
