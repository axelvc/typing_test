import styled, { css } from 'styled-components'
import Button from 'components/Button'
import Box from 'components/Box'

export const Container = styled.section`
  display: grid;
  gap: var(--space-lg);
`

/* ---------------------------------- textbox ---------------------------------- */
export const TextBox = styled.div`
  position: relative;
  transition: 200ms ease-out;
`

export const Input = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`

export const Instructions = styled.p<{ show?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  place-items: center;
  font-weight: 500;
  font-size: 1.25rem;
  transition: inherit;
  transition-delay: ${p => p.show && '1s'};
  filter: ${p => (p.show ? 'opacity(1)' : 'opacity(0)')};
`

export const Caret = styled.div<{ show?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  background: var(--color-fg);
  border-radius: var(--rounded);
  font-size: 3rem;
  transition: 100ms ease-out;
  opacity: ${p => (p.show ? 0.2 : 0)};

  &::before {
    content: '\\00a0';
  }
`

export const Text = styled.p<{ blur?: boolean }>`
  --lines-to-shown: 3;
  --font-size: 3rem;
  --gap: 1ex;
  --line-height: calc(var(--font-size) * 1.3);
  --max-height: calc(var(--line-height) * var(--lines-to-shown) + var(--gap) * (var(--lines-to-shown) - 1));

  display: flex;
  gap: 1ex 1ch;
  flex-wrap: wrap;
  max-height: var(--max-height);
  overflow: hidden;
  color: var(--color-fg-alt);
  font-size: var(--font-size);
  line-height: var(--line-height);
  user-select: none;
  transition: inherit;
  transition-delay: ${p => p.blur && '1s'};
  filter: ${p => p.blur && 'blur(4px) opacity(0.5)'};
`

export type CharType = 'current' | 'correct' | 'incorrect' | 'fixed' | 'missed' | 'extra' | null | undefined

const charColors: Record<Exclude<CharType, 'missed' | null | undefined>, string> = {
  current: 'var(--color-fg)',
  correct: 'var(--color-main)',
  incorrect: 'var(--color-error)',
  fixed: 'var(--color-fixed)',
  extra: 'var(--color-error)',
} as const

export const Char = styled.span<{ type?: CharType }>`
  color: ${p => p.type && p.type !== 'missed' && charColors[p.type]};
  transition: ${p => p.type === 'current' && '50ms color 50ms ease-out'};
  white-space: pre-wrap;

  ${p =>
    p.type === 'missed' &&
    css`
      text-decoration: underline var(--color-error);
      text-underline-offset: 35%;

      --selection-decoration: var(--color-error);
    `};

  ${p =>
    p.type === 'extra' &&
    css`
      opacity: 0.5;
      text-decoration: line-through;
    `}
`

export const Extra = styled.span`
  color: var(--color-error);
  opacity: 0.5;
  text-decoration: line-through;
`

/* ------------------------------- timer line ------------------------------- */
export const TimerLine = styled.div<{ duration?: number }>`
  width: 100%;
  height: 0.25rem;
  background: var(--color-bg-alt);
  border-radius: var(--rounded);
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    height: 100%;
    background: var(--color-main);
    border-radius: inherit;
    transform-origin: left;

    ${p =>
      p.duration &&
      css`
        transition: ${p.duration}s linear;
        transform: translateX(-100%);
      `}
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

export const CapsBox = styled(DetailBox)<{ show?: boolean }>`
  --selection-fg: var(--color-bg);
  --selection-bg: var(--color-error);

  display: flex;
  gap: var(--space-md);
  align-items: center;
  justify-self: flex-end;
  color: var(--color-error);
  border-color: var(--color-error);
  transition: 150ms opacity ease-in;
  opacity: ${p => Number(p.show)};
`
