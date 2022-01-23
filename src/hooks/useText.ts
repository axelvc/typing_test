/* eslint-disable no-param-reassign */
import create from 'zustand'
import produce from 'immer'
import getRandomWords from '../services/wordService'

interface State {
  wrongs: Record<number, boolean>[]
  words: string[][]
  inputs: string[]
  type(value: string): void
  prevWord(): void
  getWords(): void
  reset(): void
}

export default create<State>(set => ({
  wrongs: [{}],
  words: getRandomWords(),
  inputs: [''],
  type: value =>
    set(
      produce(s => {
        if (value.endsWith(' ')) {
          if (value.length > 1) {
            s.inputs.push('')
            s.wrongs.push({})
          }

          return
        }

        const inputIdx = s.inputs.length - 1
        const inputLength = s.inputs[inputIdx].length

        if (value.length > inputLength) {
          const inputChar = value.at(-1)
          const char = s.words[inputIdx].at(inputLength)

          if (char !== inputChar) {
            s.wrongs[inputIdx][inputLength] = true
          }
        }

        s.inputs[inputIdx] = value
      }),
    ),
  prevWord: () =>
    set(
      produce(s => {
        const size = s.inputs.length
        const prevIsCorrect = s.inputs[size - 2] === s.words[size - 2]?.join('')

        if (size <= 1 || prevIsCorrect) return

        s.inputs.pop()
      }),
    ),
  getWords: () =>
    set(
      produce(s => {
        s.words = [...s.words, ...getRandomWords()]
      }),
    ),
  reset: () => set({ wrongs: [{}], words: getRandomWords(), inputs: [''] }),
}))
