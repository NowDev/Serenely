import { sounds } from '../data/sounds'
import type { MixLevels, Sound, SoundId } from '../data/sounds'

export type SoundStatus = 'loading' | 'ready' | 'error'
type Channel = {
  audio: HTMLAudioElement
  source: MediaElementAudioSourceNode
  gain: GainNode
  pending: boolean
  operation: number
  stopTimer?: ReturnType<typeof setTimeout>
}

export class SoundEngine {
  private context?: AudioContext
  private master?: GainNode
  private channels = new Map<SoundId, Channel>()
  private levels: MixLevels = {}
  private playing = false
  private listener?: (id: SoundId, status: SoundStatus) => void

  subscribe(listener: (id: SoundId, status: SoundStatus) => void) {
    this.listener = listener
    return () => { this.listener = undefined }
  }

  async unlock() {
    if (!this.context) {
      this.context = new AudioContext()
      this.master = this.context.createGain()
      const limiter = this.context.createDynamicsCompressor()
      limiter.threshold.value = -6
      limiter.knee.value = 8
      limiter.ratio.value = 12
      limiter.attack.value = 0.003
      limiter.release.value = 0.25
      this.master.connect(limiter)
      limiter.connect(this.context.destination)
    }
    if (this.context.state !== 'running') await this.context.resume()
  }

  sync(levels: MixLevels, playing: boolean, volume: number) {
    this.levels = levels
    this.playing = playing
    const context = this.context
    if (!context || !this.master) return
    this.master.gain.setTargetAtTime(volume * 0.65, context.currentTime, 0.04)
    for (const [id, channel] of this.channels) {
      if (!playing || levels[id] === undefined) this.stop(id, channel)
    }
    if (!playing) return
    for (const sound of sounds) {
      if (levels[sound.id] === undefined) continue
      const channel = this.channels.get(sound.id) ?? this.createChannel(sound, context)
      clearTimeout(channel.stopTimer)
      channel.stopTimer = undefined
      channel.gain.gain.setTargetAtTime(levels[sound.id]!, context.currentTime, 0.04)
      if ((channel.audio.paused || channel.audio.error) && !channel.pending) void this.start(sound.id, channel)
    }
  }

  private createChannel(sound: Sound, context: AudioContext) {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/${sound.file}`)
    audio.loop = true
    audio.preload = 'none'
    const source = context.createMediaElementSource(audio)
    const gain = context.createGain()
    gain.gain.value = 0
    source.connect(gain)
    gain.connect(this.master!)
    const channel: Channel = { audio, source, gain, pending: false, operation: 0 }
    this.channels.set(sound.id, channel)
    const report = (status: SoundStatus) => {
      if (this.channels.get(sound.id) === channel && this.levels[sound.id] !== undefined) this.listener?.(sound.id, status)
    }
    audio.onplaying = () => report('ready')
    audio.onwaiting = () => report('loading')
    audio.onerror = () => {
      channel.operation++
      channel.pending = false
      report('error')
    }
    return channel
  }

  private async start(id: SoundId, channel: Channel) {
    const operation = ++channel.operation
    channel.pending = true
    this.listener?.(id, 'loading')
    try {
      if (channel.audio.error) channel.audio.load()
      await channel.audio.play()
      if (this.channels.get(id) !== channel) return
      if (!this.playing || this.levels[id] === undefined) channel.audio.pause()
    } catch {
      if (channel.operation === operation && this.playing && this.levels[id] !== undefined) this.listener?.(id, 'error')
    } finally {
      if (channel.operation === operation) channel.pending = false
    }
  }

  private stop(id: SoundId, channel: Channel) {
    if (channel.stopTimer !== undefined) return
    channel.gain.gain.setTargetAtTime(0, this.context!.currentTime, 0.025)
    channel.stopTimer = setTimeout(() => {
      channel.stopTimer = undefined
      channel.operation++
      channel.pending = false
      channel.audio.pause()
      if (this.levels[id] === undefined) {
        this.release(channel)
        this.channels.delete(id)
      }
    }, 150)
  }

  private release(channel: Channel) {
    clearTimeout(channel.stopTimer)
    channel.operation++
    channel.audio.onplaying = null
    channel.audio.onwaiting = null
    channel.audio.onerror = null
    channel.audio.pause()
    channel.audio.removeAttribute('src')
    channel.audio.load()
    channel.source.disconnect()
    channel.gain.disconnect()
  }

  dispose() {
    this.playing = false
    this.levels = {}
    for (const channel of this.channels.values()) this.release(channel)
    this.channels.clear()
    void this.context?.close()
    this.context = undefined
    this.master = undefined
  }
}
