import { useCallback, useState } from 'react'
import {
  PiArrowCounterClockwiseLight, PiBookmarkSimpleLight, PiCheckLight,
  PiHeadphonesLight, PiLeafLight, PiPauseFill, PiPlayFill,
  PiPlusLight, PiTimerLight, PiTrashLight,
} from 'react-icons/pi'
import { presets, sounds } from './data/sounds'
import { useMixer } from './hooks/useMixer'
import { useTimer } from './hooks/useTimer'
import { Dialog } from './components/Dialog'
import { PlayerBar } from './components/PlayerBar'
import { PresetCard } from './components/PresetCard'
import { SoundCard } from './components/SoundCard'

const primaryButton = 'flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-canvas transition hover:bg-white disabled:opacity-40'

export default function App() {
  const mixer = useMixer()
  const [view, setView] = useState<'sounds' | 'saved'>('sounds')
  const [dialog, setDialog] = useState<'timer' | 'save' | 'about' | null>(null)
  const [mixName, setMixName] = useState('')
  const { pause, setMessage } = mixer
  const onTimerComplete = useCallback(() => {
    pause()
    setDialog(null)
    setMessage('Your focus timer is complete. Take a break.')
  }, [pause, setMessage])
  const timer = useTimer(onTimerComplete)
  const selectedSounds = sounds.filter(sound => mixer.levels[sound.id] !== undefined)
  const count = selectedSounds.length

  function saveMix(event: React.FormEvent) {
    event.preventDefault()
    if (!mixer.saveMix(mixName)) return
    setMixName('')
    setDialog(null)
  }

  return (
    <div className="min-h-dvh pt-21 font-sans">
      <header className="fixed inset-x-0 top-0 z-30 h-21 border-b border-white/10 bg-canvas px-5 sm:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">
          <a href={import.meta.env.BASE_URL} aria-label="Serenely home" className="flex items-center gap-2.5 rounded text-ink">
            <PiLeafLight size={29} className="text-accent" aria-hidden="true" />
            <span className="text-[1.5rem] font-medium tracking-[-0.055em] sm:text-[1.75rem]">serenely</span>
          </a>
          <button type="button" onClick={() => setDialog('timer')} aria-label={`Focus timer: ${timer.formatted}${timer.running ? ', running' : ''}`}
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition hover:bg-white/10 ${timer.running ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/15 text-muted'}`}>
            <PiTimerLight size={20} aria-hidden="true" />
            <span className="hidden sm:inline">Focus timer</span>
            <span className="tabular-nums text-ink">{timer.formatted}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-9 pb-36 sm:px-8 sm:pt-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.875rem] font-normal tracking-[-0.045em] sm:text-4xl">Your space to focus.</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">A few sounds. A little room to think.</p>
          </div>
          <span className="hidden items-center gap-2 pb-1 text-sm text-muted sm:flex"><PiHeadphonesLight size={18} aria-hidden="true" /> Headphones welcome</span>
        </div>

        <section aria-label="Sound presets" className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {presets.map(preset => <PresetCard key={preset.id} preset={preset}
            selected={count > 0 && Object.keys(preset.levels).length === count && Object.entries(preset.levels).every(([id, level]) => mixer.levels[id as keyof typeof mixer.levels] === level)}
            onSelect={() => mixer.applyMix(preset.levels)} />)}
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/12">
          <div className="flex gap-6" aria-label="Sound library">
            <button type="button" onClick={() => setView('sounds')} aria-pressed={view === 'sounds'}
              className={`border-b-2 pb-4 text-sm font-medium transition ${view === 'sounds' ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>Sounds <span className="ml-1.5 text-xs text-muted">{sounds.length}</span></button>
            <button type="button" onClick={() => setView('saved')} aria-pressed={view === 'saved'}
              className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-medium transition ${view === 'saved' ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              <PiBookmarkSimpleLight size={17} aria-hidden="true" /> Saved mixes {mixer.saved.length > 0 && <span className="text-xs text-muted">{mixer.saved.length}</span>}
            </button>
          </div>
          <div className="mb-3 flex items-center gap-4">
            <button type="button" onClick={mixer.clear} disabled={!count} className="rounded text-sm text-muted transition hover:text-ink disabled:opacity-35">Clear</button>
            <button type="button" onClick={() => { mixer.setMessage(''); setDialog('save') }} disabled={!count}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-sm transition hover:border-accent/50 hover:bg-white/5 disabled:opacity-35">
              <PiPlusLight size={16} aria-hidden="true" /> Save mix
            </button>
          </div>
        </div>

        {view === 'sounds' ? (
          <section aria-label="Ambient sounds" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {sounds.map(sound => <SoundCard key={sound.id} sound={sound} level={mixer.levels[sound.id]} status={mixer.statuses[sound.id]} playing={mixer.playing}
              onToggle={() => mixer.toggle(sound.id)} onVolume={value => mixer.setLevel(sound.id, value)} onRetry={() => mixer.applyMix(mixer.levels)} />)}
          </section>
        ) : (
          <section aria-label="Saved mixes" className="min-h-80 py-4">
            {mixer.saved.length ? <div className="grid gap-3 sm:grid-cols-2">
              {mixer.saved.map(mix => <div key={mix.id} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 p-4">
                <button type="button" onClick={() => mixer.applyMix(mix.levels)} aria-label={`Play ${mix.name}`} className="rounded-full bg-accent/10 p-3 text-accent hover:bg-accent/20"><PiPlayFill size={19} /></button>
                <div className="min-w-0 flex-1"><h2 className="truncate font-medium">{mix.name}</h2><p className="mt-1 text-sm text-muted">{Object.keys(mix.levels).length} sounds</p></div>
                <button type="button" onClick={() => mixer.removeMix(mix.id)} aria-label={`Delete ${mix.name}`} className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-ink"><PiTrashLight size={20} /></button>
              </div>)}
            </div> : <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <PiBookmarkSimpleLight size={38} className="mb-4 text-muted" aria-hidden="true" />
              <h2 className="text-lg font-medium">Keep your favorite mix.</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">Select your sounds, adjust the volume, then save your mix here.</p>
              <button type="button" onClick={() => setView('sounds')} className="mt-5 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Explore sounds</button>
            </div>}
          </section>
        )}

        <footer className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-muted">
          <p>Mix your sounds. Find your calm.</p>
          <button type="button" onClick={() => setDialog('about')} className="rounded transition hover:text-ink">About & sound credits</button>
        </footer>
      </main>

      {mixer.message && <div role="status" className="fixed right-4 bottom-25 left-4 z-30 mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl border border-accent/25 bg-panel p-4 text-sm shadow-lg">
        <span>{mixer.message}</span><button type="button" onClick={() => mixer.setMessage('')} aria-label="Dismiss message" className="rounded p-1"><PiCheckLight size={20} /></button>
      </div>}

      <PlayerBar count={count} playing={mixer.playing} volume={mixer.volume} names={selectedSounds.map(sound => sound.name).join(' · ')}
        readyCount={selectedSounds.filter(sound => mixer.statuses[sound.id] === 'ready').length}
        errorCount={selectedSounds.filter(sound => mixer.statuses[sound.id] === 'error').length}
        onToggle={mixer.playing ? mixer.pause : mixer.play} onVolume={mixer.setVolume} />

      <Dialog open={dialog === 'save'} onClose={() => setDialog(null)} title="Save your mix">
        <form onSubmit={saveMix}>
          <label htmlFor="mix-name" className="mb-2 block text-sm text-muted">Mix name</label>
          <input id="mix-name" value={mixName} onChange={event => setMixName(event.target.value)} required maxLength={40} placeholder="My quiet afternoon"
            className="w-full rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-base text-ink placeholder:text-muted" />
          <p className="mt-3 text-sm text-muted">Saved in this browser on this device.</p>
          {mixer.message && <p role="status" className="mt-3 text-sm text-accent">{mixer.message}</p>}
          <button type="submit" disabled={!mixName.trim() || !count} className={`${primaryButton} mt-6 w-full`}>Save mix</button>
        </form>
      </Dialog>

      <Dialog open={dialog === 'timer'} onClose={() => setDialog(null)} title="Focus timer">
        <p className="text-sm leading-relaxed text-muted">Set aside some time. Your sounds stop when the timer ends.</p>
        <p className="my-7 text-center text-6xl font-light tracking-tight tabular-nums" aria-live="off">{timer.formatted}</p>
        <div className="grid grid-cols-3 gap-2">
          {[15, 25, 50].map(minutes => <button key={minutes} type="button" onClick={() => timer.chooseDuration(minutes)} aria-pressed={timer.duration === minutes}
            className={`rounded-xl border px-2 py-3 text-sm ${timer.duration === minutes ? 'border-accent/50 bg-accent/15 text-accent' : 'border-white/15 text-muted hover:bg-white/5'}`}>{minutes} min</button>)}
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={timer.reset} aria-label="Reset timer" className="rounded-xl border border-white/20 p-3 text-muted hover:text-ink"><PiArrowCounterClockwiseLight size={22} /></button>
          <button type="button" disabled={!count && !timer.running} onClick={() => { if (timer.running) timer.pause(); else { timer.start(); mixer.play() } }} className={`${primaryButton} flex-1`}>
            {timer.running ? <PiPauseFill size={17} /> : <PiPlayFill size={17} />}{timer.running ? 'Pause timer' : 'Start timer'}
          </button>
        </div>
        {!count && <p className="mt-3 text-center text-sm text-muted">Select a sound to start your focus timer.</p>}
      </Dialog>

      <Dialog open={dialog === 'about'} onClose={() => setDialog(null)} title="A little space to focus">
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>Serenely brings your favorite background sounds together. Select any number of sounds and adjust each volume.</p>
          <p>Your mixes stay in this browser. Audio starts only when you select a sound or press play.</p>
        </div>
      </Dialog>
    </div>
  )
}
