import styled from 'styled-components'

export default styled.button.attrs({ type: 'button' })`
  min-height: 2rem;
  padding: 0 var(--space-md);
  color: var(--color-fg-alt);
  border-radius: var(--rounded);
  font-weight: 500;
  user-select: none;
  transition: 150ms;
  transition-property: color, background;

  &:hover {
    color: var(--color-fg);
  }

  &:hover,
  &:active {
    background: var(--color-bg-alt);
  }

  &:focus-visible,
  &:active {
    color: var(--color-main);
  }
`
