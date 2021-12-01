import styled from 'styled-components'
interface PropsSoundCard {
  title: string
  description: string
  href?: string
}
export const SoundCard: React.FC<PropsSoundCard> = props => {
  return (
    <>
      <SoundCardContainer>
        <a className="card" href={props?.href}>
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </a>
      </SoundCardContainer>
    </>
  )
}

const SoundCardContainer = styled.div`
  width: 12rem;
  margin-bottom: 0.6rem;
  .card {
    display: inline-flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    width: 110px;
    height: 85px;
    margin: 0px 24px 40px;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out 0s;
    cursor: pointer;
    position: relative;
  }

  .card:hover {
    opacity: 1;
  }
  .card:focus,
  .card:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  .card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .card p {
    margin: 0;
    font-size: 1.1rem;
  }
`
