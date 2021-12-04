import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function PageLayout(props: PageLayoutProps) {
  return <PageLayoutStyled {...props}>{props.children}</PageLayoutStyled>
}

const PageLayoutStyled = styled.div`
  height: 100%;
  margin: 0 auto;
  // Celulares
  @media (max-width: 768px) {
    max-width: auto;
  }
  // Tablets
  @media (min-width: 768px) {
    max-width: 46.875rem;
  }
  // Desktop HD
  @media (max-width: 992px) {
    max-width: 60.625rem;
  }
  // Desktop FULL HD
  @media (max-width: 1200px) {
    max-width: 73.125rem;
  }
`
