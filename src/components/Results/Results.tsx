import useText from '../../useText'
import useTimer from '../../useTimer'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import * as S from './Results.style'

export default function Results() {
  const inputs = useText(s => s.inputs)
  const words = useText(s => s.words)
  const wrongs = useText(s => s.wrongs)
  const resetText = useText(s => s.reset)
  const totalTime = useTimer(s => s.totalTime)
  const resetTimer = useTimer(s => s.reset)

  const total = inputs.reduce((a, w) => a + w.length + 1, -1)
  const wrongRaw = Object.values(wrongs).reduce((a, i) => a + Object.values(i).length, 0)
  const extra = inputs.reduce((a, w, i) => a + w.slice(words[i].length).length, 0)
  const missed = inputs.slice(0, -1).reduce((a, w, i) => a + Math.max(words[i].length - w.length, 0), 0)
  const fixed = inputs.flatMap((w, wi) => [...w].filter((c, ci) => c === words[wi][ci] && wrongs[wi]?.[ci])).length
  const correct = total - wrongRaw
  const incorrect = wrongRaw - fixed - extra
  const wpm = correct / 5 / (totalTime / 60)
  const acc = ((correct * 100) / total).toFixed(2)

  function handleReset() {
    resetText()
    resetTimer()
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
        <ResetIcon />
      </S.Button>
    </S.Container>
  )
}
