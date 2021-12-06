import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Slider from '@mui/material/Slider'
interface PropsSoundCard {
  title: string
  description?: string
  enabled?: boolean
  href?: string
}

export const SoundCard: React.FC<PropsSoundCard> = props => {
  const [enabled, setEnabled] = useState(props.enabled || false)
  const [volume, setVolume] = useState(50)

  const volumeChange = (event: Event, value: number | number[]) => {
    setVolume(value as number)
  }
  function handleClick() {
    setEnabled(!enabled)
  }

  return (
    <SoundCardContainer onClick={handleClick} enabled={enabled}>
      <div className="cardRoot">
        <a className="card">
          <h3>{props.title}</h3>
        </a>
      </div>
      {enabled && <Slider aria-label="Volume" value={volume} onChange={volumeChange} />}
    </SoundCardContainer>
  )
}

const SoundCardContainer = styled.div<{ enabled: boolean }>`
  width: 8rem;
  height: 8rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-width: 0.15rem;
  border-radius: 1rem;
  border-color: ${props => (props.enabled ? '#4a63ec' : '#424242ba')};
  :hover {
    border-color: #4a63ec;
  }
  .cardRoot {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out 0s;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card:hover {
    opacity: 1;
    color: #4a63ec;
    border-color: #4a63ec;
  }
  .card:focus,
  .card:active {
    color: #4a63ec;
    border-color: #4a63ec;
  }

  .card h3 {
    font-size: 1rem;
  }

  .card p {
    margin: 0;
    font-size: 0.8rem;
  }
`
