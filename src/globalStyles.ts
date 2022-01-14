import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  :root {
    --color-fg: #ebf0f5;
    --color-fg-alt: #414462;
    --color-bg: #0c0d11;
    --color-bg-alt: #171a26;
    --color-main: #85e0ab;
    --color-error: #f65555;
    --color-fixed: #ffc34c;

    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 2rem;

    --rounded: 0.25rem;
  }

  ::selection {
    color: var(--selection-fg, var(--color-bg));
    background: var(--selection-bg, var(--color-main));
    text-decoration-color: var(--selection-decoration, currentColor);
  }

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-bg-alt);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-fg-alt);

    &:hover {
      background: var(--color-fg);
    }
  }

  * {
    margin: 0;
    padding: 0;
    letter-spacing: 0.05em;

    &:focus-visible {
      outline: 0.125rem solid currentColor;
    }
  }

  ul {
    list-style: none;
  }

  body {
    color: var(--color-fg);
    background: var(--color-bg);
    font-family: 'IBM Plex Mono', monospace;
  }

  button {
    color: inherit;
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
  }

  #root {
    max-width: 1000px;
    padding: var(--space-lg);
    margin: auto;
  }

  .icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`
