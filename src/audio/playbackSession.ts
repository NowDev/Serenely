type AudioSession = {
  type: 'auto' | 'playback' | 'transient' | 'transient-solo' | 'ambient' | 'play-and-record'
}

type AudioNavigator = Navigator & { audioSession?: AudioSession }

export function requestPlaybackSession(): () => void {
  const session = (navigator as AudioNavigator).audioSession
  if (!session) return () => {}
  const previous = session.type
  try {
    session.type = 'playback'
  } catch {
    return () => {}
  }
  return () => {
    try {
      if (session.type === 'playback') session.type = previous
    } catch {
      // Some browsers expose the API without allowing changes.
    }
  }
}

function setAction(session: MediaSession, action: MediaSessionAction, handler: MediaSessionActionHandler | null) {
  try {
    session.setActionHandler(action, handler)
  } catch {
    // A browser can support Media Session without supporting every action.
  }
}

export function bindPlaybackControls(play: () => void, pause: () => void): () => void {
  const session = navigator.mediaSession
  if (!session) return () => {}
  setAction(session, 'play', play)
  setAction(session, 'pause', pause)
  setAction(session, 'stop', pause)
  return () => {
    for (const action of ['play', 'pause', 'stop'] as const) setAction(session, action, null)
    session.playbackState = 'none'
    session.metadata = null
  }
}

export function updatePlaybackSession(names: string[], playing: boolean) {
  const session = navigator.mediaSession
  if (!session) return
  session.playbackState = names.length ? (playing ? 'playing' : 'paused') : 'none'
  session.metadata = names.length && typeof MediaMetadata !== 'undefined'
    ? new MediaMetadata({ title: names.join(', '), artist: 'Serenely', album: 'Ambient sounds' })
    : null
}
