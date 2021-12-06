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
  function handleClick(changeState: boolean) {
    if (changeState) {
      if (!enabled) setEnabled(true)
    } else {
      setEnabled(!enabled)
    }
  }

  return (
    <SoundCardContainer onClick={() => handleClick(true)} enabled={enabled}>
      <div className="cardRoot">
        <a className="card" onClick={() => handleClick(false)}>
          <h3>{props.title}</h3>
        </a>
      </div>
      {enabled && (
        <SliderContainer>
          <Slider aria-label="Volume" value={volume} onChange={volumeChange} />
        </SliderContainer>
      )}
    </SoundCardContainer>
  )
}

const SoundCardContainer = styled.div<{ enabled: boolean }>`
  width: 8rem;
  height: 8rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  cursor: ${props => (props.enabled ? 'default' : 'pointer')};
  border-style: solid;
  border-width: 0.15rem;
  border-radius: 1rem;
  border-color: ${props => (props.enabled ? '#4a63ec' : '#424242ba')};
  :hover {
    border-color: #4a63ec;
    .card {
      opacity: 1;
      color: #4a63ec;
      border-color: #4a63ec;
      h3 {
        color: #4a63ec;
      }
    }
  }
  :focus,
  :active {
    color: #4a63ec;
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
    opacity: ${props => (props.enabled ? '0.8' : '0.5')};
    transition: opacity 0.2s ease-in-out 0s;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card h3 {
    font-size: 1rem;
    color: ${props => (props.enabled ? '#4a63ec' : '#424242ba')};
  }

  .card p {
    margin: 0;
    font-size: 0.8rem;
  }
`
const SliderContainer = styled.div`
  margin: 0px 0.5rem 0px 0.5rem;
  padding-bottom: 0.5rem;
`
