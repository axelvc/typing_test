import styled, { css } from 'styled-components'
import Button from '../Button'
import Box from '../Box'

export const Container = styled.section`
  margin-top: 8rem;
  display: grid;
  gap: var(--space-lg);
`

/* ---------------------------------- text ---------------------------------- */
export const Input = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`

export const Text = styled.p`
  display: flex;
  gap: 1.5ch 1ch;
  flex-wrap: wrap;
  font-size: 3rem;
  user-select: none;
  color: var(--color-fg-alt);
`

const letterColors = {
  correct: 'var(--color-main)',
  incorrect: 'var(--color-error)',
  fixed: 'var(--color-fixed)',
} as const

export const Letter = styled.span<{ type?: 'correct' | 'incorrect' | 'fixed' | 'missed'; current?: boolean }>`
  color: ${p => p.type && p.type !== 'missed' && letterColors[p.type]};

  ${p =>
    p.type === 'missed' &&
    css`
      text-decoration: underline;
      text-decoration-color: var(--color-error);
      text-underline-offset: 35%;

      --selection-decoration: var(--color-error);
    `};

  ${p =>
    p.current &&
    css`
      color: var(--color-bg);
      background: var(--color-main);
      border-radius: var(--rounded);
    `}
`

/* ---------------------------------- line ---------------------------------- */
export const Line = styled.div`
  width: 100%;
  height: 0.25rem;
  background: var(--color-bg-alt);
  border-radius: var(--rounded);

  div {
    height: 100%;
    background: var(--color-main);
    border-radius: inherit;
  }
`

/* --------------------------------- details -------------------------------- */
export const Details = styled.div`
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(3, 1fr);
  font-size: 1.5rem;
  font-weight: 500;
`

export const DetailBox = styled(Box)`
  justify-self: flex-start;
  padding: var(--space-md) var(--space-lg);
`

export const ResetButton = styled(Button)`
  justify-self: center;
  aspect-ratio: 1;
`

export const CapsBox = styled(DetailBox)`
  --selection-fg: var(--color-bg);
  --selection-bg: var(--color-error);

  display: flex;
  gap: var(--space-md);
  align-items: center;
  justify-self: flex-end;
  color: var(--color-error);
  border-color: var(--color-error);
`

/* --------------------------------- results -------------------------------- */
export const Results = styled.section`
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(10, 1fr);
  margin: calc(8rem + var(--space-lg)) auto;
`

export const ResultBox = styled(Box)`
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