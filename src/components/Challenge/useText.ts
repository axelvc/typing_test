/* eslint-disable no-param-reassign */
import { useReducer } from 'react'
import produce from 'immer'
import getRandomWords from '../../services/wordService'

type Action =
  | { type: 'TYPE'; payload: string }
  | { type: 'PREV_WORD'; payload: boolean }
  | { type: 'RESET' }
  | { type: 'GET_WORDS' }

interface State {
  wrongs: Record<number, Record<number, true>>
  words: string[][]
  inputs: string[]
}

const initialState: State = {
  wrongs: {},
  inputs: [''],
  words: getRandomWords(),
}

function reducer(state: State, aciton: Action): State {
  switch (aciton.type) {
    case 'TYPE':
      return produce(state, d => {
        const value = aciton.payload
        const { length } = value

        if (value.endsWith(' ')) {
          if (length > 1) d.inputs.push('')

          return
        }

        const inputIdx = d.inputs.length - 1
        const inputLength = d.inputs[inputIdx].length

        if (length > inputLength) {
          const inputChar = value.at(-1)
          const char = d.words[inputIdx].at(inputLength)

          if (char !== inputChar) {
            d.wrongs[inputIdx] ||= {}
            d.wrongs[inputIdx][inputLength] = true
          }
        }

        d.inputs[inputIdx] = value
      })
    case 'PREV_WORD':
      return produce(state, d => {
        const { length } = d.inputs
        if (length <= 1 || d.inputs[length - 2] === d.words[length - 2].join('')) return

        d.inputs.pop()

        const isCtrl = aciton.payload
        if (isCtrl) {
          d.inputs[d.inputs.length - 1] = ''
        }
      })
    case 'RESET':
      return produce(initialState, d => {
        d.words = getRandomWords()
      })
    case 'GET_WORDS':
      return produce(state, d => {
        d.words = [...d.words, ...getRandomWords()]
      })
    default:
      throw new Error('Unknown action type')
  }
}

export default () => useReducer(reducer, initialState)