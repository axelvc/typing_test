/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef } from 'react'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import { ReactComponent as LockIcon } from '../icons/LockIcon.svg'
import * as S from './Challenge.style'
import useText from './useText'

export default function Challenge() {
  /* -------------------------------- caps lock ------------------------------- */
  const [capsLock, setCapsLock] = useState(false)

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

  /* ------------------------------ blur textbox ------------------------------ */
  const [textFocused, setTextFoucused] = useState(true)
  const inputBox = useRef<HTMLInputElement>(null)

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

  /* --------------------------------- typing --------------------------------- */
  const [textState, dispatch] = useText()
  const inputIdx = textState.inputs.length - 1
  const currentInput = textState.inputs[inputIdx]

  function handleBackspace(ev: React.KeyboardEvent) {
    if (ev.key !== 'Backspace' || currentInput !== '') return

    ev.preventDefault()
    dispatch({ type: 'PREV_WORD', payload: ev.ctrlKey })
  }

  function getType(char: string, wi: number, ci: number): S.CharType {
    const inputWord = textState.inputs[wi]

    if (wi > inputIdx) return

    if (wi === inputIdx) {
      const inputCi = inputWord.length

      if (ci > inputCi) return
      if (ci === inputCi) return 'current'
    }

    const inputChar = inputWord[ci]

    if (!inputChar) return 'missed'
    if (inputChar !== char) return 'incorrect'
    if (textState.wrongs[wi]?.[ci]) return 'fixed'

    return 'correct'
  }

  function getExtraChars(word: string[], wi: number): string {
    const chars = textState.inputs[wi] || ''

    return chars.slice(word.length)
  }

  function isLastWordChar(word: string[], wi: number): boolean {
    return wi === inputIdx && currentInput.length >= word.length
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
    inputBox.current?.focus()
  }

  return (
    <S.Container>
      <S.TextBox onClick={() => inputBox.current?.focus()}>
        <S.Input
          type="text"
          data-testid="challengeInput"
          autoFocus
          ref={inputBox}
          value={currentInput}
          onChange={ev => dispatch({ type: 'TYPE', payload: ev.target.value })}
          onKeyDown={ev => handleBackspace(ev)}
          onFocus={() => setTextFoucused(true)}
          onBlur={() => setTextFoucused(false)}
        />

        <S.Instructions textFocused={textFocused} data-testid="challengeInstructions">
          Click here or type any key to focus the text
        </S.Instructions>

        <S.Text textFocused={textFocused} data-testid="challengeText">
          {textState.words.map((word, wi) => (
            <span key={wi}>
              {word.map((char, ci) => (
                <S.Char key={ci} type={getType(char, wi, ci)} data-testid="challengeChar">
                  {char}
                </S.Char>
              ))}
              {getExtraChars(word, wi) && <S.Extra>{getExtraChars(word, wi)}</S.Extra>}
              <S.Char type={isLastWordChar(word, wi) ? 'current' : null} data-testid="challengeCharSpace">
                &nbsp;
              </S.Char>
            </span>
          ))}
        </S.Text>
      </S.TextBox>

      <S.Line>
        <div style={{ width: '70%' }} />
      </S.Line>

      <S.Details>
        <S.DetailBox>01:51</S.DetailBox>
        <S.ResetButton title="reset" onClick={() => handleReset()}>
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
