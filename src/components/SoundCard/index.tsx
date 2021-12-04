import styled from 'styled-components'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(0, 0, 0, 0.45)'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  }
}))
interface PropsSoundCard {
  title: string
  description?: string
  href?: string
}
export const SoundCard: React.FC<PropsSoundCard> = props => {
  return (
    <>
      <SoundCardContainer>
        <a className="card" href={props?.href}>
          <BootstrapTooltip title={props?.description}>
            <h3>{props.title}</h3>
          </BootstrapTooltip>
        </a>
      </SoundCardContainer>
    </>
  )
}

const SoundCardContainer = styled.div`
  width: 8rem;
  height: 8rem;
  margin-bottom: 1.5rem;
  outline: auto;
  .card {
    display: inline-flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out 0s;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card:hover {
    opacity: 1;
    color: #5c6bc0;
    border-color: #5c6bc0;
  }
  .card:focus,
  .card:active {
    color: #5c6bc0;
    border-color: #5c6bc0;
  }

  .card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .card p {
    margin: 0;
    font-size: 0.8rem;
  }
`
