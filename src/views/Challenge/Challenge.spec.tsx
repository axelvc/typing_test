import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useText from 'hooks/useText'
import Challenge from './Challenge'

beforeEach(() => render(<Challenge />))

describe('Challenge component', () => {
  it('should focus the box at the beginning', () => {
    const input = screen.getByTestId('challengeInput')

    expect(input).toHaveFocus()
  })

  it('should change text when click reset button', () => {
    const reset = screen.getByRole('button', { name: /reset/i })
    const textBox = screen.getByTestId('challengeText')
    const text = textBox.textContent as string

    userEvent.click(reset)
    expect(textBox.textContent).not.toBe(text)
  })

  describe('text box scroll', () => {
    it.todo('should scroll on typing')
    it.todo('should not scroll if the prev word is above the text box')

    it('should get new words if is close to the end of the text', () => {
      const words = useText.getState().words.map(word => word.join(''))
      const textBox = screen.getByTestId('challengeText')

      userEvent.keyboard(words.join(' '))

      expect(textBox.childElementCount).toBe(words.length * 2)
    })
  })

  describe('typing box', () => {
    it.todo('caret')

    describe('type feedback', () => {
      it('should have correct styles', () => {
        const char = screen.getAllByTestId('challengeChar')[0]

        userEvent.keyboard(char.textContent!)
        expect(char).toHaveStyleRule('color', 'var(--color-main)')
      })

      it('should have incorrect styles', () => {
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(chars[1].textContent!)
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-error)')
      })

      it('should have fixed styles', () => {
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(chars[1].textContent!)
        userEvent.keyboard('{Backspace}')
        userEvent.keyboard(chars[0].textContent!)
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-fixed)')
      })

      it('should have current styles', () => {
        const chars = screen.getAllByTestId('challengeChar')

        expect(chars[0]).toHaveStyleRule('color', 'var(--color-fg)')
      })

      it('should have missed styles', () => {
        const word = useText.getState().words[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(chars[0].textContent!)
        userEvent.keyboard(' ')

        chars.slice(1, word.length).forEach(char => {
          expect(char).toHaveStyleRule('text-decoration', 'underline var(--color-error)')
          expect(char).toHaveStyleRule('text-underline-offset', '35%')
        })
      })

      it('should print the extra typed chars', () => {
        const word = useText.getState().words[0].join('')
        const extra = 'some-extra-chars'

        userEvent.keyboard(word)
        userEvent.keyboard(extra)

        const chars = screen.getAllByTestId('challengeChar')
        chars.slice(word.length, extra.length).forEach(char => {
          expect(char).toHaveStyleRule('color', 'var(--color-error)')
          expect(char).toHaveStyleRule('opacity', '0.5')
          expect(char).toHaveStyleRule('text-decoration', 'line-through')
        })
      })
    })
  })
})
