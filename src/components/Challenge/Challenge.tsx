/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef, useMemo } from 'react'
import useText from '../../hooks/useText'
import useTimer from '../../hooks/useTimer'

import { ReactComponent as ResetIcon } from '../icons/ResetIcon.svg'
import { ReactComponent as LockIcon } from '../icons/LockIcon.svg'
import * as S from './Challenge.style'

function getHumanTime(time: number): string {
  const MINUTE_IN_SECS = 60
  const mins = Math.floor(time / MINUTE_IN_SECS)
  const secs = time % MINUTE_IN_SECS
  const pad = (s: number) => `${s}`.padStart(2, '0')

  return `${pad(mins)}:${pad(secs)}`
}

let caretTop = 0

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

  useEffect(() => {
    const focusText = () => inputBox.current?.focus()

    window.addEventListener('focus', focusText)
    return () => window.removeEventListener('focus', focusText)
  }, [])

  /* --------------------------------- typing --------------------------------- */
  const text = useText()
  const inputIdx = text.inputs.length - 1
  const currentInput = text.inputs[inputIdx]
  const wordBoxes = useRef<HTMLSpanElement[]>([])
  const textBox = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const REMAINING_WORDS_LIMIT = 10
    const totalWords = text.words.length

    if (totalWords - inputIdx <= REMAINING_WORDS_LIMIT) {
      text.getWords()
    }
  }, [inputIdx])

  useEffect(() => {
    const word = wordBoxes.current[inputIdx]

    if (!inputIdx || word.offsetLeft !== 0) return

    const tb = textBox.current!
    const prevTop = (word.previousElementSibling as HTMLSpanElement).offsetTop

    if (prevTop - tb.scrollTop > 0) {
      tb.scrollTop = prevTop
    }
  }, [inputIdx])

  function handleType(val: string) {
    const totalWidth = textBox.current!.offsetWidth
    const wordBox = wordBoxes.current[inputIdx]
    const charWidth = wordBox.offsetWidth / wordBox.childElementCount
    const nextWidth = wordBox.offsetLeft + charWidth * val.length

    if (nextWidth > totalWidth && !val.endsWith(' ')) return

    text.type(val)
  }

  function handleBackspace(ev: React.KeyboardEvent) {
    if (ev.key !== 'Backspace' || currentInput !== '' || !inputIdx) return

    const topLimit = wordBoxes.current[inputIdx - 1].offsetTop
    const prevWordTop = textBox.current!.scrollTop
    if (prevWordTop > topLimit) return

    if (!ev.ctrlKey) ev.preventDefault()
    text.prevWord()
  }

  function getType(char: string, input: string, wi: number, ci: number): S.CharType {
    if (wi > inputIdx) return

    if (wi === inputIdx) {
      const inputCi = input.length

      if (ci > inputCi) return
      if (ci === inputCi) return 'current'
    }

    const inputChar = input[ci]

    if (!inputChar) return 'missed'
    if (inputChar !== char) return 'incorrect'
    if (text.wrongs[wi][ci]) return 'fixed'

    return 'correct'
  }

  function getChars(wi: number): { char: string; type: S.CharType }[] {
    const word = text.words[wi]
    const input = text.inputs[wi]
    const chars = word.map((char, ci) => ({ char, type: getType(char, input, wi, ci) }))

    if (input) {
      chars.push(
        ...input
          .slice(word.length)
          .split('')
          .map(char => ({ char, type: 'extra' as S.CharType })),
      )
    }

    return chars
  }

  /* ---------------------------------- caret --------------------------------- */
  const caretBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const caret = caretBox.current!
    const word = wordBoxes.current[inputIdx]
    const left = word.offsetLeft + currentInput.length * caret.offsetWidth
    const top = word.offsetTop
    const scrollTop = top - textBox.current!.scrollTop
    const center = textBox.current!.offsetHeight / 2

    if (inputIdx === 0) {
      caretTop = top
    } else if (scrollTop <= center) {
      caretTop = scrollTop
    }

    caret.style.transform = `translate(${left}px, ${caretTop}px)`
  }, [currentInput, inputIdx])

  /* ---------------------------------- timer --------------------------------- */
  const timer = useTimer()
  const humanTime = useMemo(() => getHumanTime(timer.leftTime), [timer.leftTime])
  const [lineAnimation, setLineAnimation] = useState<Animation | null>(null)
  const lineBox = useRef<HTMLDivElement>(null)

  function resetFocus() {
    textBox.current!.scrollTop = 0
    inputBox.current!.focus()
    lineAnimation?.cancel()
  }

  function handleReset() {
    text.reset()
    timer.reset()
    resetFocus()
  }

  useEffect(resetFocus, [timer.totalTime])

  useEffect(() => {
    if (!currentInput || timer.timerId) return

    const animation = lineBox.current!.animate([{ width: '100%' }, { width: '0%' }], {
      duration: timer.leftTime * 1000,
      easing: 'linear',
      fill: 'forwards',
    })

    setLineAnimation(animation)
    timer.start()
  }, [!inputIdx && !currentInput])

  return (
    <S.Container>
      <S.TextBox onClick={() => inputBox.current?.focus()}>
        <S.Input
          type="text"
          data-testid="challengeInput"
          autoFocus
          ref={inputBox}
          value={currentInput}
          onCopy={ev => ev.preventDefault()}
          onPaste={ev => ev.preventDefault()}
          onSelect={ev => (ev.target as HTMLInputElement).setSelectionRange(-1, -1)}
          onFocus={() => setTextFoucused(true)}
          onBlur={() => setTextFoucused(false)}
          onChange={ev => handleType(ev.target.value)}
          onKeyDown={ev => handleBackspace(ev)}
        />

        <S.Instructions textFocused={textFocused} data-testid="challengeInstructions">
          Click here or type any key to focus the text
        </S.Instructions>

        <S.Caret ref={caretBox} />

        <S.Text textFocused={textFocused} data-testid="challengeText" ref={textBox}>
          {text.words.map((_, wi) => (
            <span
              key={wi}
              ref={el => {
                wordBoxes.current[wi] = el!
              }}
            >
              {getChars(wi).map(({ char, type }, ci) => (
                <S.Char key={ci} type={type}>
                  {char}
                </S.Char>
              ))}
            </span>
          ))}
        </S.Text>
      </S.TextBox>

      <S.Line>
        <div ref={lineBox} />
      </S.Line>

      <S.Details>
        <S.DetailBox>{humanTime}</S.DetailBox>
        <S.ResetButton title="reset" onClick={() => handleReset()}>
          <ResetIcon className="icon" />
        </S.ResetButton>
        <S.CapsBox style={{ opacity: capsLock ? 1 : 0 }}>
          CAPS LOCK
          <LockIcon className="icon" />
        </S.CapsBox>
      </S.Details>
    </S.Container>
  )
}
