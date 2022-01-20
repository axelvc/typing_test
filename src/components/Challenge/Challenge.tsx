/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef } from 'react'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import { ReactComponent as LockIcon } from '../icons/LockIcon.svg'
import * as S from './Challenge.style'
import useText from './useText'
import useTimer from '../../useTimer'

function humanTime(time: number) {
  const MINUTE_IN_SECS = 60
  const mins = Math.floor(time / MINUTE_IN_SECS)
  const secs = time % MINUTE_IN_SECS
  const pad = (s: number) => `${s}`.padStart(2, '0')

  return `${pad(mins)}:${pad(secs)}`
}

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
  const wordBoxes = useRef<HTMLSpanElement[]>([])
  const textBox = useRef<HTMLParagraphElement>(null)
  const [textState, dispatch] = useText()
  const inputIdx = textState.inputs.length - 1
  const currentInput = textState.inputs[inputIdx]

  useEffect(() => {
    const REMAINING_WORDS_LIMIT = 10
    const totalWords = textState.words.length

    if (totalWords - inputIdx <= REMAINING_WORDS_LIMIT) {
      dispatch({ type: 'GET_WORDS' })
    }
  }, [inputIdx])

  useEffect(() => {
    const el = wordBoxes.current[inputIdx]
    const tb = textBox.current

    if (!el || !tb) return

    const height = el.offsetHeight
    const wordTop = el.offsetTop - tb.scrollTop

    if (wordTop > height) {
      tb.scrollTop += height
    }
  }, [inputIdx])

  function handleBackspace(ev: React.KeyboardEvent) {
    if (ev.key !== 'Backspace' || currentInput !== '') return

    const prevWordTop = wordBoxes.current[inputIdx - 1]?.offsetTop || 0
    const scrollTop = textBox.current?.scrollTop || 0

    if (scrollTop > prevWordTop) return

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

  /* ---------------------------------- timer --------------------------------- */
  const timer = useTimer()
  const lineBox = useRef<HTMLDivElement>(null)
  const [lineAnimation, setLineAnimation] = useState<Animation | null>(null)

  function handleType(value: string) {
    dispatch({ type: 'TYPE', payload: value })

    if (timer.timerId) return

    const animation = lineBox.current!.animate([{ width: '100%' }, { width: '0%' }], {
      duration: timer.leftTime * 1000,
      easing: 'linear',
      fill: 'forwards',
    })

    setLineAnimation(animation)
    timer.start()
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
    inputBox.current!.focus()

    if (!timer.timerId) return

    timer.reset()
    textBox.current!.scrollTop = 0
    lineAnimation!.cancel()
  }

  useEffect(() => {
    if (timer.timerId) handleReset()
  }, [timer.totalTime])

  return (
    <S.Container>
      <S.TextBox onClick={() => inputBox.current?.focus()}>
        <S.Input
          type="text"
          data-testid="challengeInput"
          autoFocus
          ref={inputBox}
          value={currentInput}
          onChange={ev => timer.leftTime && handleType(ev.target.value)}
          onKeyDown={ev => timer.leftTime && handleBackspace(ev)}
          onFocus={ev => {
            ev.target.setSelectionRange(-1, -1)
            setTextFoucused(true)
          }}
          onBlur={() => setTextFoucused(false)}
        />

        <S.Instructions textFocused={textFocused} data-testid="challengeInstructions">
          Click here or type any key to focus the text
        </S.Instructions>

        <S.Text textFocused={textFocused} data-testid="challengeText" ref={textBox}>
          {textState.words.map((word, wi) => (
            <span
              key={wi}
              ref={el => {
                wordBoxes.current[wi] = el as HTMLSpanElement
              }}
            >
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
        <div ref={lineBox} />
      </S.Line>

      <S.Details>
        <S.DetailBox>{humanTime(timer.leftTime)}</S.DetailBox>
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
