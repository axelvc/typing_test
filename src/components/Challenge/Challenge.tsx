import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import { ReactComponent as LockIcon } from '../icons/LockIcon.svg'
import * as S from './Challenge.style'

export default function Challenge() {
  return (
    <S.Container>
      <S.Input type="text" />

      <S.Text>
        <span>
          <S.Letter type="correct">O</S.Letter>
          <S.Letter type="correct">n</S.Letter>
          <S.Letter type="correct">e</S.Letter>
        </span>
        <span>
          <S.Letter type="correct">m</S.Letter>
          <S.Letter type="correct">o</S.Letter>
          <S.Letter type="correct">r</S.Letter>
          <S.Letter type="correct">n</S.Letter>
          <S.Letter type="correct">i</S.Letter>
          <S.Letter type="missed">n</S.Letter>
          <S.Letter type="missed">g</S.Letter>
        </span>
        <span>
          <S.Letter type="correct">w</S.Letter>
          <S.Letter type="correct">h</S.Letter>
          <S.Letter type="fixed">e</S.Letter>
          <S.Letter type="incorrect">n</S.Letter>
        </span>
        <span>
          <S.Letter type="correct">G</S.Letter>
          <S.Letter type="correct">r</S.Letter>
          <S.Letter type="correct">e</S.Letter>
          <S.Letter type="incorrect">g</S.Letter>
          <S.Letter type="incorrect">o</S.Letter>
          <S.Letter type="incorrect">r</S.Letter>
        </span>
        <span>
          <S.Letter current>S</S.Letter>
          <S.Letter>a</S.Letter>
          <S.Letter>m</S.Letter>
          <S.Letter>s</S.Letter>
          <S.Letter>a</S.Letter>
        </span>

        <span>woke</span>
        <span>from</span>
        <span>troubled</span>
        <span>dreams</span>
        <span>he</span>
        <span>found</span>
        <span>himself</span>
        <span>transported</span>
        <span>to</span>
      </S.Text>

      <S.Line>
        <div style={{ width: '70%' }} />
      </S.Line>

      <S.Details>
        <S.DetailBox>01:51</S.DetailBox>
        <S.ResetButton>
          <ResetIcon className="icon" />
        </S.ResetButton>
        <S.CapsBox>
          CAPS LOCK
          <LockIcon className="icon" />
        </S.CapsBox>
      </S.Details>

      <S.Results>
        <S.ResultBox>
          <span>WPM</span>
          70
        </S.ResultBox>
        <S.ResultBox>
          <span>ACC</span>
          94%
        </S.ResultBox>

        <S.ResultBox>
          <span>Correct</span>
          290
        </S.ResultBox>
        <S.ResultBox>
          <span>Incorrect</span>
          23
        </S.ResultBox>
        <S.ResultBox>
          <span>Fixed</span>
          32
        </S.ResultBox>
        <S.ResultBox>
          <span>Extra</span>6
        </S.ResultBox>
        <S.ResultBox>
          <span>Missed</span>
          10
        </S.ResultBox>
      </S.Results>
    </S.Container>
  )
}
