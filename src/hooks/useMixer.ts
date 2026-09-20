import { useCallback, useEffect, useRef, useState } from 'react'
import { SoundEngine } from '../audio/SoundEngine'
import type { SoundStatus } from '../audio/SoundEngine'
import { bindPlaybackControls, updatePlaybackSession } from '../audio/playbackSession'
import { sounds } from '../data/sounds'
import type { MixLevels, SoundId } from '../data/sounds'
import { readPreferences, writePreferences } from '../lib/storage'

export function useMixer() {
  const [initial] = useState(readPreferences)
  const [engine] = useState(() => new SoundEngine())
  const [levels, setLevels] = useState(initial.levels)
  const [volume, setVolume] = useState(initial.volume)
  const [saved, setSaved] = useState(initial.saved)
  const [playing, setPlaying] = useState(false)
  const [statuses, setStatuses] = useState<Partial<Record<SoundId, SoundStatus>>>({})
  const [message, setMessage] = useState('')
  const playRequest = useRef(0)
  const cancelPlayRequest = useCallback(() => { playRequest.current++ }, [])

  useEffect(() => {
    const unsubscribe = engine.subscribe((id, status) => setStatuses(previous => ({ ...previous, [id]: status })))
    return () => { cancelPlayRequest(); unsubscribe(); engine.dispose() }
  }, [cancelPlayRequest, engine])

  useEffect(() => { engine.sync(levels, playing, volume) }, [engine, levels, playing, volume])
  useEffect(() => {
    if (!writePreferences({ levels, volume, saved })) setMessage('Your browser could not save this mix.')
  }, [levels, volume, saved])

  const play = useCallback(() => {
    const request = ++playRequest.current
    setMessage('')
    void engine.unlock().then(() => {
      if (request === playRequest.current) setPlaying(true)
    }).catch(() => {
      if (request !== playRequest.current) return
      setPlaying(false)
      setMessage('Audio could not start. Select play to try again.')
    })
  }, [engine])

  const pause = useCallback(() => { cancelPlayRequest(); setPlaying(false) }, [cancelPlayRequest])

  useEffect(() => bindPlaybackControls(play, pause), [play, pause])
  useEffect(() => {
    updatePlaybackSession(sounds.filter(sound => levels[sound.id] !== undefined).map(sound => sound.name), playing)
  }, [levels, playing])

  function toggle(id: SoundId) {
    if (levels[id] !== undefined) {
      setLevels(previous => { const next = { ...previous }; delete next[id]; return next })
    } else {
      setLevels(previous => ({ ...previous, [id]: 0.5 }))
      play()
    }
  }

  function applyMix(mix: MixLevels) { setLevels({ ...mix }); play() }
  function clear() { setLevels({}); pause() }
  function setLevel(id: SoundId, level: number) { setLevels(previous => ({ ...previous, [id]: level })) }

  function saveMix(name: string) {
    if (!name.trim() || !Object.keys(levels).length) return false
    if (saved.length >= 30) { setMessage('Remove a saved mix before you save another.'); return false }
    const next = [...saved, { id: crypto.randomUUID(), name: name.trim().slice(0, 40), levels: { ...levels } }]
    if (!writePreferences({ levels, volume, saved: next })) {
      setMessage('Your browser could not save this mix.')
      return false
    }
    setSaved(next)
    setMessage('Mix saved on this device.')
    return true
  }

  return {
    levels, volume, setVolume, saved, playing: playing && Object.keys(levels).length > 0,
    statuses, message, setMessage, play, pause, toggle, applyMix, clear, setLevel, saveMix,
    removeMix: (id: string) => setSaved(previous => previous.filter(mix => mix.id !== id)),
  }
}
