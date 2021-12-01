import styled from 'styled-components'
import { useRouter } from 'next/dist/client/router'

export const Header: React.FC = () => {
  const router = useRouter()
  return (
    <ContainerHeader>
      <div className="content" onClick={() => router.replace('/')}>
        <p>Serenely</p>
      </div>
    </ContainerHeader>
  )
}

const ContainerHeader = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  justify-content: center;
  background-color: black;
  p {
    color: white;
  }
  .content {
    width: max-content;
    cursor: pointer;
  }
`

export default Header
