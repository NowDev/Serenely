import { useEffect, useState } from 'react'

export function useTimer(onComplete: () => void) {
  const [duration, setDuration] = useState(25)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(25 * 60)

  useEffect(() => {
    if (deadline === null) return
    function tick() {
      const seconds = Math.max(0, Math.ceil((deadline! - Date.now()) / 1000))
      setRemaining(seconds)
      if (!seconds) { setDeadline(null); onComplete() }
    }
    tick()
    const interval = window.setInterval(tick, 250)
    return () => window.clearInterval(interval)
  }, [deadline, onComplete])

  function chooseDuration(minutes: number) {
    setDuration(minutes)
    setRemaining(minutes * 60)
    setDeadline(null)
  }

  return {
    duration, remaining, running: deadline !== null, chooseDuration,
    start: () => { const seconds = remaining || duration * 60; setRemaining(seconds); setDeadline(Date.now() + seconds * 1000) },
    pause: () => setDeadline(null),
    reset: () => { setDeadline(null); setRemaining(duration * 60) },
    formatted: `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`,
  }
}
