import { useEffect, useState, useRef } from 'react'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import { ReactComponent as LockIcon } from '../icons/LockIcon.svg'
import * as S from './Challenge.style'

export default function Challenge() {
  const [capsLock, setCapsLock] = useState(false)
  const [textFocused, setTextFoucused] = useState(true)
  const inputBox = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let firstCheck = true

    function checkCapsLock(ev: KeyboardEvent) {
      if (ev.key === 'CapsLock' || firstCheck) {
        setCapsLock(ev.getModifierState('CapsLock'))
        firstCheck = false
      }
    }

    window.addEventListener('keyup', checkCapsLock)

    return () => window.removeEventListener('keyup', checkCapsLock)
  }, [])

  useEffect(() => {
    if (textFocused) return () => {}

    function focusText(ev: KeyboardEvent) {
      const isSpecial = ev.ctrlKey || ev.metaKey || ev.altKey || ev.key.length > 1

      if (isSpecial) return

      ev.preventDefault()
      inputBox.current?.focus()
    }

    document.documentElement.addEventListener('keydown', focusText)
    return () => document.documentElement.removeEventListener('keydown', focusText)
  }, [textFocused])

  return (
    <S.Container>
      <S.TextBox textFocused={textFocused}>
        <S.Input
          type="text"
          autoFocus
          ref={inputBox}
          onFocus={() => setTextFoucused(true)}
          onBlur={() => setTextFoucused(false)}
        />

        <S.Instructions textFocused={textFocused}>Click here or type any key to focus the text</S.Instructions>

        <S.Text onClick={() => inputBox.current?.focus()} textFocused={textFocused}>
          <span>
            <S.Char type="correct">O</S.Char>
            <S.Char type="correct">n</S.Char>
            <S.Char type="correct">e</S.Char>
          </span>
          <span>
            <S.Char type="correct">m</S.Char>
            <S.Char type="correct">o</S.Char>
            <S.Char type="correct">r</S.Char>
            <S.Char type="correct">n</S.Char>
            <S.Char type="correct">i</S.Char>
            <S.Char type="missed">n</S.Char>
            <S.Char type="missed">g</S.Char>
          </span>
          <span>
            <S.Char type="correct">w</S.Char>
            <S.Char type="correct">h</S.Char>
            <S.Char type="fixed">e</S.Char>
            <S.Char type="incorrect">n</S.Char>
          </span>
          <span>
            <S.Char type="correct">G</S.Char>
            <S.Char type="correct">r</S.Char>
            <S.Char type="correct">e</S.Char>
            <S.Char type="incorrect">g</S.Char>
            <S.Char type="incorrect">o</S.Char>
            <S.Char type="incorrect">r</S.Char>
          </span>
          <span>
            <S.Char current>S</S.Char>
            <S.Char>a</S.Char>
            <S.Char>m</S.Char>
            <S.Char>s</S.Char>
            <S.Char>a</S.Char>
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
      </S.TextBox>

      <S.Line>
        <div style={{ width: '70%' }} />
      </S.Line>

      <S.Details>
        <S.DetailBox>01:51</S.DetailBox>
        <S.ResetButton>
          <ResetIcon className="icon" />
        </S.ResetButton>
        <S.CapsBox style={{ opacity: capsLock ? 1 : 0 }}>
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
