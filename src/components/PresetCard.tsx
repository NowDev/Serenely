import type { Preset } from '../data/sounds'

export function PresetCard({ preset, selected, onSelect }: { preset: Preset; selected: boolean; onSelect: () => void }) {
  const Icon = preset.icon
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected}
      className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 motion-reduce:transform-none ${selected ? 'border-accent/45 bg-accent/15' : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'}`}>
      <Icon size={29} className="shrink-0 text-accent" aria-hidden="true" />
      <span>
        <span className="block text-[0.9375rem] font-medium text-ink">{preset.name}</span>
        <span className="mt-1 hidden text-xs leading-relaxed text-muted xl:block">{preset.description}</span>
      </span>
    </button>
  )
}
