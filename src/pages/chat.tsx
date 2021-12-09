import { Header } from '../components/Header'
import styled from 'styled-components'

export default function Chat() {
  return (
    <>
      <Header />
      <ContainerRoot>
        <h2>Chat</h2>
      </ContainerRoot>
    </>
  )
}

const ContainerRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`
