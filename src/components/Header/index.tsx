import styled from 'styled-components'
import { useRouter } from 'next/dist/client/router'

export const Header: React.FC = () => {
  const router = useRouter()
  return (
    <ContainerHeader>
      <div className="header">
        <div className="content" onClick={() => router.replace('/')}>
          <p>Serenely</p>
        </div>
      </div>
      <div className="ant-header" />
    </ContainerHeader>
  )
}

const ContainerHeader = styled.div`
  .ant-header {
    height: 3.5rem;
  }
  .header {
    display: flex;
    position: fixed;
    height: 3.5rem;
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
  }
`

export default Header
