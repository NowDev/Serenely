import styled from 'styled-components'

export const Header: React.FC = () => {
  return (
    <ContainerHeader>
      <div className="content">
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
  }
`

export default Header
