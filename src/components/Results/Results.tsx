import useText from '../../hooks/useText'
import useTimer from '../../hooks/useTimer'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import * as S from './Results.style'

export default function Results() {
  const text = useText()
  const timer = useTimer()

  let correct = 0
  let incorrect = 0
  let fixed = 0
  let extra = 0
  let missed = 0

  text.words.slice(0, text.inputs.length).forEach((word, wi) => {
    const input = text.inputs[wi]
    const wl = word.length
    const il = input.length
    const diff = Math.abs(wl - il)

    word.slice(0, il).forEach((char, ci) => {
      if (char !== input[ci]) {
        incorrect += 1
      } else if (text.wrongs[wi][ci]) {
        fixed += 1
      } else {
        correct += 1
      }
    })

    if (il > wl) {
      extra += diff
    }

    if (wi < text.inputs.length - 1) {
      missed += diff
      correct += 1
    }
  })

  const right = correct + fixed
  const total = correct + incorrect + fixed + extra
  const acc = Math.round((right * 100) / total || 0)
  const wpm = Math.round(correct / 5 / (timer.totalTime / 60))

  function handleReset() {
    text.reset()
    timer.reset()
  }

  return (
    <S.Container>
      <S.Results>
        <S.Box>
          <span>WPM</span>
          {wpm}
        </S.Box>
        <S.Box>
          <span>ACC</span>
          {acc}%
        </S.Box>
        <S.Box>
          <span>Correct</span>
          {correct}
        </S.Box>
        <S.Box>
          <span>Incorrect</span>
          {incorrect}
        </S.Box>
        <S.Box>
          <span>Fixed</span>
          {fixed}
        </S.Box>
        <S.Box>
          <span>Extra</span>
          {extra}
        </S.Box>
        <S.Box>
          <span>Missed</span>
          {missed}
        </S.Box>
      </S.Results>

      <S.Button onClick={() => handleReset()}>
        <ResetIcon className="icon" />
      </S.Button>
    </S.Container>
  )
}
