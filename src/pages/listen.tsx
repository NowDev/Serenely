import styled from 'styled-components'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { SoundCard } from '../components/SoundCard'

export default function Listen() {
  return (
    <>
      <Header />
      <ContainerRoot>
        <main>
          <p className="description">Get started by listening something!</p>

          <div className="container">
            <div className="wrapper">
              <SoundCard title="CoffeeShop" description="People talking and some machinery" />
              <SoundCard title="Thunderstorm" description="Thunders and rain, not so quietly..." />
              <SoundCard title="Train" description="The sound a train on rails" />
              <SoundCard title="Rain" description="Classic sound of a light rain" />
              <SoundCard title="Tropical Forest" description="Calm sounds of nature" />
              <SoundCard title="CoffeeShop" description="People talking and some machinery" />
              <SoundCard title="Thunderstorm" description="Thunders and rain, not so quietly..." />
              <SoundCard title="Train" description="The sound a train on rails" />
              <SoundCard title="Rain" description="Classic sound of a light rain" />
              <SoundCard title="Tropical Forest" description="Calm sounds of nature" />
            </div>
          </div>
        </main>
        <Footer />
      </ContainerRoot>
    </>
  )
}

const ContainerRoot = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #7986cb;
  main {
    width: 95%;
    padding: 5rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  .container {
    width: 100%;
  }

  .title a {
    color: #0070f3;
    text-decoration: none;
  }

  .title a:hover,
  .title a:focus,
  .title a:active {
    text-decoration: underline;
  }

  .title {
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
  }

  .title,
  .description {
    text-align: center;
  }

  .description {
    line-height: 1.5;
    font-size: 1.5rem;
  }

  code {
    background: #fafafa;
    border-radius: 5px;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New,
      monospace;
  }

  .grid {
    margin: 84px auto auto;
    padding-bottom: 60px;
    max-width: 268px;
  }
  @media (min-width: 576px) {
    .grid {
      max-width: 540px;
    }
  }
  @media (min-width: 768px) {
    .grid {
      max-width: 584px;
    }
  }

  .wrapper {
    margin: 0px -24px;
  }
  @media (min-width: 576px) {
    .wrapper {
      margin: 0px -16.5px;
    }
  }
  @media (min-width: 768px) {
    .wrapper {
      margin: 0px -24px;
    }
  }
`
