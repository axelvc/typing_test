import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Challenge from './Challenge'

let container: HTMLElement
beforeEach(() => {
  container = render(<Challenge />).container
})

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

  describe('bluring', () => {
    it('should focus input on click in the box', () => {
      const input = screen.getByTestId('challengeInput')
      const text = screen.getByTestId('challengeText')

      userEvent.click(container)
      expect(input).not.toHaveFocus()

      userEvent.click(text)
      expect(input).toHaveFocus()
    })

    it('should blur/focus the text on lost focus', () => {
      const instructions = screen.getByTestId('challengeInstructions')
      const text = screen.getByTestId('challengeText')

      // blur
      userEvent.click(container)
      expect(instructions).not.toHaveStyleRule('filter')
      expect(text).toHaveStyleRule('filter', 'blur(4px) opacity(0.5)')

      // focus
      userEvent.click(text)
      expect(instructions).toHaveStyleRule('filter', 'opacity(0)')
      expect(text).not.toHaveStyleRule('filter')
    })
  })

  describe('typing box', () => {
    const isCurrent = (char: HTMLElement) => {
      expect(char).toHaveStyleRule('color', 'var(--color-bg)')
      expect(char).toHaveStyleRule('background', 'var(--color-main)')
      expect(char).toHaveStyleRule('border-radius', 'var(--rounded)')
    }

    describe('type feedback', () => {
      it('should have correct styles', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[0])
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-main)')
      })

      it('should have incorrect styles', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[1])
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-error)')
      })

      it('should have fixed styles', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[1])
        userEvent.keyboard('{Backspace}')
        userEvent.keyboard(word[0])
        expect(chars[0]).toHaveStyleRule('color', 'var(--color-fixed)')
      })

      it('should have current styles', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')
        const spaces = screen.getAllByTestId('challengeCharSpace')

        isCurrent(chars[0])
        userEvent.keyboard(word[0])
        isCurrent(chars[1])
        userEvent.keyboard('{Backspace}')
        isCurrent(chars[0])

        userEvent.keyboard(word)
        isCurrent(spaces[0])
      })

      it('should have missed styles', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[1])
        userEvent.keyboard(' ')

        chars.slice(1, word.length).forEach(char => {
          expect(char).toHaveStyleRule('text-decoration', 'underline var(--color-error)')
          expect(char).toHaveStyleRule('text-underline-offset', '35%')
        })
      })

      it('should print the extra typed chars', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const extra = 'some-extra-chars'

        userEvent.keyboard(word)
        userEvent.keyboard(extra)

        const extraBox = screen.queryByText(extra)
        expect(extraBox).toBeInTheDocument()
        expect(extraBox).toHaveStyleRule('color', 'var(--color-error)')
        expect(extraBox).toHaveStyleRule('opacity', '0.5')
        expect(extraBox).toHaveStyleRule('text-decoration', 'line-through')
      })
    })

    describe('current position', () => {
      it('should stay if type space at start of the word', () => {
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(' ')

        isCurrent(chars[0])
      })

      it('should jump to the next word', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[1])
        userEvent.keyboard(' ')

        isCurrent(chars[word.length])
      })

      it('should stay if type backspace and the previous word is full correct', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word)
        userEvent.keyboard(' ')
        userEvent.keyboard('{Backspace}')

        isCurrent(chars[word.length])
      })

      it('should jump to previous word', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word.slice(1) + word[0])
        userEvent.keyboard(' ')
        userEvent.keyboard('{Backspace}{Backspace}')

        isCurrent(chars[word.length - 1])
      })

      it('should return to last missed character', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word[0])
        userEvent.keyboard(' ')
        userEvent.keyboard('{Backspace}')

        isCurrent(chars[1])
      })

      it('should return to previous word and clear it if use ctrl key', () => {
        const word = screen.getByTestId('challengeText').textContent!.split(/\s/)[0]
        const chars = screen.getAllByTestId('challengeChar')

        userEvent.keyboard(word.slice(0, -1))
        userEvent.keyboard(' ')
        userEvent.keyboard('{ctrl>}{Backspace}{/ctrl}')

        isCurrent(chars[0])
      })
    })
  })
})
