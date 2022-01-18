import styled from 'styled-components'
import ButtonBase from '../Button'

export const Header = styled.header`
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
`

export const Button = styled(ButtonBase)`
  font-size: 0.875rem;

  &[aria-pressed='true'] {
    color: var(--color-main);
  }
`
