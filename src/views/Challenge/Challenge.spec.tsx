import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useText from 'hooks/useText'
import Challenge from './Challenge'

let user: ReturnType<typeof userEvent.setup>

beforeEach(() => {
  user = userEvent.setup()
  render(<Challenge />)
})

describe('Challenge component', () => {
  it('should focus the box at the beginning', () => {
    const input = screen.getByTestId('challengeInput')

    expect(input).toHaveFocus()
  })

  it('should change text when click reset button', async () => {
    const reset = screen.getByRole('button', { name: /reset/i })
    const textBox = screen.getByTestId('challengeText')
    const text = textBox.textContent as string

    await user.click(reset)
    expect(textBox.textContent).not.toBe(text)
  })

  describe('text box scroll', () => {
    it.todo('should scroll on typing')
    it.todo('should not scroll if the prev word is above the text box')

    it('should get new words if is close to the end of the text', async () => {
      const words = useText.getState().words.map(word => word.join(''))
      const textBox = screen.getByTestId('challengeText')

      await user.keyboard(words.join(' '))

      expect(textBox.childElementCount).toBe(words.length * 2)
    })
  })

  describe('typing box', () => {
    it.todo('caret')

    describe('type feedback', () => {
      it('should have correct styles', async () => {
        const chars = screen.getAllByTestId('challengeChar')

        await user.keyboard(chars[0].textContent!)
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-main)')
      })

      it('should have incorrect styles', async () => {
        const chars = screen.getAllByTestId('challengeChar')

        await user.keyboard(chars[1].textContent!)
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-error)')
      })

      it('should have fixed styles', async () => {
        const chars = screen.getAllByTestId('challengeChar')

        await user.keyboard(chars[1].textContent!)
        await user.keyboard('{Backspace}')
        await user.keyboard(chars[0].textContent!)

        expect(chars[0]).toHaveStyleRule('color', 'var(--color-fixed)')
      })

      it('should have current styles', () => {
        const chars = screen.getAllByTestId('challengeChar')

        expect(chars[0]).toHaveStyleRule('color', 'var(--color-fg)')
      })

      it('should have missed styles', async () => {
        const word = useText.getState().words[0]
        const chars = screen.getAllByTestId('challengeChar')

        await user.keyboard(chars[0].textContent!)
        await user.keyboard(' ')

        chars.slice(1, word.length).forEach(char => {
          expect(char).toHaveStyleRule('text-decoration', 'underline var(--color-error)')
          expect(char).toHaveStyleRule('text-underline-offset', '35%')
        })
      })

      it('should print the extra typed chars', async () => {
        const word = useText.getState().words[0].join('')
        const extra = 'some-extra-chars'

        await user.keyboard(word)
        await user.keyboard(extra)

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
