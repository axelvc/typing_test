import styled, { css } from 'styled-components'
import Button from '../Button'
import Box from '../Box'

export const Container = styled.section`
  display: grid;
  gap: var(--space-lg);
`

/* ---------------------------------- textbox ---------------------------------- */
interface TextBoxProps {
  textFocused: boolean
}

export const TextBox = styled.div`
  position: relative;
  transition: 200ms ease-out;
`

export const Instructions = styled.p<TextBoxProps>`
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
  filter: ${p => p.textFocused && 'opacity(0)'};
`

export const Input = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`

export const Text = styled.p<TextBoxProps>`
  --lines-to-shown: 3;
  --font-size: 3rem;
  --line-height: calc(var(--font-size) * 2);
  --max-height: calc(var(--line-height) * var(--lines-to-shown));

  display: flex;
  flex-wrap: wrap;
  max-height: var(--max-height);
  overflow: hidden;
  color: var(--color-fg-alt);
  font-size: var(--font-size);
  line-height: var(--line-height);
  user-select: none;
  transition: inherit;
  filter: ${p => !p.textFocused && 'blur(4px) opacity(0.5)'};
`

export type CharType = 'current' | 'correct' | 'incorrect' | 'fixed' | 'missed' | null | undefined

const charColors: Record<Exclude<CharType, 'missed' | null | undefined>, string> = {
  current: 'var(--color-bg)',
  correct: 'var(--color-main)',
  incorrect: 'var(--color-error)',
  fixed: 'var(--color-fixed)',
} as const

export const Char = styled.span<{ type?: CharType }>`
  color: ${p => p.type && p.type !== 'missed' && charColors[p.type]};

  ${p =>
    p.type === 'missed' &&
    css`
      text-decoration: underline var(--color-error);
      text-underline-offset: 35%;

      --selection-decoration: var(--color-error);
    `};

  ${p =>
    p.type === 'current' &&
    css`
      background: var(--color-main);
      border-radius: var(--rounded);
    `}
`

export const Extra = styled.span`
  color: var(--color-error);
  opacity: 0.5;
  text-decoration: line-through;
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
  transition: 150ms opacity ease-in;
`
