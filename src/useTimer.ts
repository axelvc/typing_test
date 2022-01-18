import create from 'zustand'

const STORAGE_KEY = 'typing-time'
const INITIAL_TIME = 60

interface State {
  time: number
  setTime(time: number): void
}

function getLocalTime(): number {
  const saved = localStorage.getItem(STORAGE_KEY)

  return saved !== null ? Number(saved) : INITIAL_TIME
}

function setLocalTime(time: number) {
  localStorage.setItem(STORAGE_KEY, time.toString())
}

export default create<State>(set => ({
  time: getLocalTime(),
  setTime: time =>
    set(() => {
      setLocalTime(time)
      return { time }
    }),
}))
