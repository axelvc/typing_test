import create from 'zustand'

const STORAGE_KEY = 'typing-time'
const INITIAL_TIME = 60

interface State {
  timerId: number
  totalTime: number
  leftTime: number
  setTime(time: number): void
  start(): void
  reset(): void
}

function getLocalTime(): number {
  const saved = localStorage.getItem(STORAGE_KEY)

  return saved !== null ? Number(saved) : INITIAL_TIME
}

function setLocalTime(time: number) {
  localStorage.setItem(STORAGE_KEY, time.toString())
}

export default create<State>(set => ({
  timerId: 0,
  leftTime: getLocalTime(),
  totalTime: getLocalTime(),
  setTime: time =>
    set(() => {
      setLocalTime(time)
      return { totalTime: time, leftTime: time }
    }),
  start: () => {
    const id = window.setInterval(() => {
      set(s => {
        if (s.leftTime === 1) clearInterval(id)

        return { leftTime: s.leftTime - 1 }
      })
    }, 1000)

    set({ timerId: id })
  },
  reset: () =>
    set(s => {
      clearInterval(s.timerId)

      return { timerId: 0, leftTime: s.totalTime }
    }),
}))
