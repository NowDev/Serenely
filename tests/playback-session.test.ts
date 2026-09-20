import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { TestContext } from 'node:test'
import { SoundEngine } from '../src/audio/SoundEngine'
import { bindPlaybackControls, requestPlaybackSession, updatePlaybackSession } from '../src/audio/playbackSession'

function replaceGlobal(t: TestContext, name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name)
  Object.defineProperty(globalThis, name, { configurable: true, value })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, name, previous)
    else Reflect.deleteProperty(globalThis, name)
  })
}

test('the engine requests playback before creating audio and restores the session on disposal', async t => {
  const audioSession = { type: 'ambient' }
  replaceGlobal(t, 'navigator', { audioSession })
  let closed = false
  class Context {
    state = 'suspended'
    destination = {}
    constructor() { assert.equal(audioSession.type, 'playback') }
    createGain() { return { connect() {} } }
    createDynamicsCompressor() {
      return { threshold: {}, knee: {}, ratio: {}, attack: {}, release: {}, connect() {} }
    }
    async resume() { this.state = 'running' }
    async close() { closed = true }
  }
  replaceGlobal(t, 'AudioContext', Context)
  const engine = new SoundEngine()
  await engine.unlock()
  await engine.unlock()
  assert.equal(audioSession.type, 'playback')
  engine.dispose()
  assert.equal(audioSession.type, 'ambient')
  assert.equal(closed, true)
  await engine.unlock()
  assert.equal(audioSession.type, 'playback')
  engine.dispose()
  assert.equal(audioSession.type, 'ambient')
})

test('unsupported session APIs do not block playback', t => {
  replaceGlobal(t, 'navigator', {})
  requestPlaybackSession()()
  bindPlaybackControls(() => {}, () => {})()
  updatePlaybackSession(['Rain'], true)
})

test('a rejected audio session request does not block playback', t => {
  replaceGlobal(t, 'navigator', {
    audioSession: { get type() { return 'auto' }, set type(_value) { throw new Error('Unsupported') } },
  })
  assert.doesNotThrow(() => requestPlaybackSession()())
})

test('session cleanup preserves a later audio session change', t => {
  const audioSession = { type: 'auto' }
  replaceGlobal(t, 'navigator', { audioSession })
  const restore = requestPlaybackSession()
  audioSession.type = 'play-and-record'
  restore()
  assert.equal(audioSession.type, 'play-and-record')
})

test('media controls operate the mix and clear state during cleanup', t => {
  const handlers = new Map<string, (() => void) | null>()
  const session = {
    playbackState: 'none',
    metadata: null as MediaMetadataInit | null,
    setActionHandler(action: string, handler: (() => void) | null) { handlers.set(action, handler) },
  }
  replaceGlobal(t, 'navigator', { mediaSession: session })
  replaceGlobal(t, 'MediaMetadata', class {
    constructor(data: MediaMetadataInit) { Object.assign(this, data) }
  })
  let playing = false
  const unbind = bindPlaybackControls(() => { playing = true }, () => { playing = false })
  handlers.get('play')!()
  assert.equal(playing, true)
  updatePlaybackSession(['Rain', 'Forest'], playing)
  assert.equal(session.playbackState, 'playing')
  assert.equal(session.metadata?.title, 'Rain, Forest')
  handlers.get('pause')!()
  updatePlaybackSession(['Rain', 'Forest'], playing)
  assert.equal(session.playbackState, 'paused')
  handlers.get('play')!()
  handlers.get('stop')!()
  assert.equal(playing, false)
  updatePlaybackSession([], true)
  assert.equal(session.playbackState, 'none')
  assert.equal(session.metadata, null)
  unbind()
  assert.deepEqual([...handlers.values()], [null, null, null])
})

test('an unsupported media action does not prevent other controls', t => {
  const actions: string[] = []
  replaceGlobal(t, 'navigator', {
    mediaSession: {
      setActionHandler(action: string) {
        if (action === 'stop') throw new Error('Unsupported')
        actions.push(action)
      },
    },
  })
  const unbind = bindPlaybackControls(() => {}, () => {})
  assert.deepEqual(actions, ['play', 'pause'])
  assert.doesNotThrow(unbind)
})
