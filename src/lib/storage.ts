import { sanitizeLevels } from '../data/sounds'
import type { MixLevels } from '../data/sounds'

export interface SavedMix { id: string; name: string; levels: MixLevels }
export interface Preferences { levels: MixLevels; volume: number; saved: SavedMix[] }
const key = 'serenely.preferences.v1'

export function readPreferences(): Preferences {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}')
    return {
      levels: sanitizeLevels(value?.levels),
      volume: typeof value?.volume === 'number' && Number.isFinite(value.volume) ? Math.max(0, Math.min(1, value.volume)) : 0.7,
      saved: Array.isArray(value?.saved) ? value.saved.filter((mix: SavedMix) =>
        mix && typeof mix.id === 'string' && typeof mix.name === 'string' && mix.name.trim(),
      ).slice(0, 30).map((mix: SavedMix) => ({ id: mix.id, name: mix.name.slice(0, 40), levels: sanitizeLevels(mix.levels) })) : [],
    }
  } catch {
    return { levels: {}, volume: 0.7, saved: [] }
  }
}

export function writePreferences(preferences: Preferences): boolean {
  try { localStorage.setItem(key, JSON.stringify(preferences)); return true }
  catch { return false }
}
