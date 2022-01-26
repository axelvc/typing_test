import styled from 'styled-components'
import BoxBase from 'components/Box'
import ButtonBase from 'components/Button'

export const Container = styled.section`
  display: grid;
  gap: var(--space-lg);
  justify-items: center;
`

export const Results = styled.div`
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(10, 1fr);
`

export const Box = styled(BoxBase)`
  display: grid;
  place-items: center;
  grid-column: span 2;
  font-size: 2rem;
  aspect-ratio: 1;

  span {
    color: var(--color-fg-alt);
    font-size: 0.5em;
    font-weight: 500;
  }

  &:nth-child(7n + 1),
  &:nth-child(7n + 2) {
    grid-column: span 5;
    font-size: 3rem;
    aspect-ratio: 3/1;
  }
`

export const Button = styled(ButtonBase)`
  width: 4.375rem;
  aspect-ratio: 1;
`
