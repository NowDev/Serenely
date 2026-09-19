import { PiPauseFill, PiPlayFill, PiSpeakerHighLight, PiSpeakerSlashLight } from 'react-icons/pi'

interface PlayerBarProps {
  count: number
  playing: boolean
  readyCount: number
  errorCount: number
  volume: number
  names: string
  onToggle: () => void
  onVolume: (volume: number) => void
}

export function PlayerBar({ count, playing, readyCount, errorCount, volume, names, onToggle, onVolume }: PlayerBarProps) {
  const VolumeIcon = volume ? PiSpeakerHighLight : PiSpeakerSlashLight
  const playbackLabel = readyCount > 0
    ? `${readyCount} ${readyCount === 1 ? 'sound' : 'sounds'} playing`
    : errorCount === count ? 'Playback needs attention' : 'Loading your mix'
  return (
    <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-canvas px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-10">
      <div className="mx-auto flex max-w-5xl items-center gap-4 sm:gap-6">
        <button type="button" onClick={onToggle} disabled={!count} aria-label={playing ? 'Pause all sounds' : 'Play selected sounds'}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-canvas transition hover:bg-white disabled:opacity-35 sm:size-14">
          {playing ? <PiPauseFill size={22} /> : <PiPlayFill size={22} className="ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium sm:text-base">{count ? playing ? playbackLabel : `${count} ${count === 1 ? 'sound' : 'sounds'} selected` : 'A quiet place to start'}</p>
          <p className="mt-1 truncate text-xs text-muted sm:text-sm">{count ? names : 'Select a sound or try a preset.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <VolumeIcon size={22} className="hidden shrink-0 text-muted sm:block" aria-hidden="true" />
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center justify-between gap-3 text-xs text-muted"><span>Volume</span><span className="tabular-nums">{Math.round(volume * 100)}%</span></span>
            <input type="range" min="0" max="100" value={Math.round(volume * 100)} aria-label="Master volume"
              onChange={event => onVolume(Number(event.target.value) / 100)} className="h-4 w-20 sm:w-32" />
          </label>
        </div>
      </div>
    </div>
  )
}
