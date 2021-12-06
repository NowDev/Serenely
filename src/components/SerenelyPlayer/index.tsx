import { useState, useEffect, useMemo, useRef } from 'react'

interface PropsSerenelyPlayer {
  uuid: string
  enabled: boolean
  volume?: number
  player?: HTMLAudioElement
}

export const SerenelyPlayer: React.FC<PropsSerenelyPlayer> = props => {
  const [enabled, setEnabled] = useState(props.enabled)
  const [volume, setVolume] = useState(props.volume || 1)

  useEffect(() => {
    setEnabled(props.enabled)
  }, [props.enabled])

  useEffect(() => {
    setVolume(props.volume || 1)
  }, [props.volume])

  const audioRef = useRef<HTMLAudioElement>(
    typeof Audio !== 'undefined' && new Audio('/sounds/' + props.uuid + '/hls_0.mp3')
  )

  async function playbackState(state: boolean) {
    const play = () => {
      audioRef.current.play()
    }
    const pause = () => {
      audioRef.current.pause()
    }

    if (typeof audioRef.current !== 'undefined' && audioRef.current !== null && audioRef.current.src !== undefined) {
      state ? play() : pause()
    }
  }

  useMemo(() => {
    if (enabled) {
      playbackState(true)
    } else {
      playbackState(false)
    }
  }, [enabled])

  useEffect(() => {
    if (audioRef.current !== undefined && audioRef.current !== null && audioRef.current.src !== undefined) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  return <>{props.children}</>
}

export default SerenelyPlayer
