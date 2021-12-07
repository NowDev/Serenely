import { useState } from 'react'
import styled from 'styled-components'
import Slider from '@mui/material/Slider'
import SerenelyPlayer from '../SerenelyPlayer'
interface PropsSoundCard {
  title: string
  description?: string
  enabled?: boolean
  uuid: string
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
      <SerenelyPlayer uuid={props.uuid} enabled={enabled} volume={volume} />
      <SliderContainer enabled={enabled}>
        <Slider
          aria-label="Volume"
          size="small"
          value={volume}
          onChange={volumeChange}
          sx={{
            color: '#4a63ec',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 #6f82f0'
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)'
                }`
              },
              '&.Mui-active': {
                width: 20,
                height: 20
              }
            },
            '& .MuiSlider-rail': {
              opacity: 0.28
            }
          }}
        />
      </SliderContainer>
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
    border-color: #6f82f0;
    .card {
      opacity: 1;
      color: #6f82f0;
      border-color: #6f82f0;
      h3 {
        color: #6f82f0;
      }
    }
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
const SliderContainer = styled.div<{ enabled: boolean }>`
  margin: 0px 0.5rem 0px 0.5rem;
  padding-bottom: 0.5rem;
  display: ${props => (props.enabled ? 'block' : 'none')};
`
