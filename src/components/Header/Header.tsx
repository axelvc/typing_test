import useTimer from '../../useTimer'
import useText from '../../useText'

import * as S from './Header.style'

const TIMES = [
  [15, '15s'],
  [30, '30s'],
  [60, '1m'],
  [120, '2m'],
] as const

export default function Header() {
  const timePicked = useTimer(s => s.totalTime)
  const resetTimer = useTimer(s => s.reset)
  const resetText = useText(s => s.reset)

  function handleClick(time: number) {
    resetTimer(time)
    resetText()
  }

  return (
    <S.Header>
      {TIMES.map(([time, name]) => (
        <S.Button key={time} aria-pressed={timePicked === time} onClick={() => handleClick(time)}>
          {name}
        </S.Button>
      ))}
    </S.Header>
  )
}
