import create from 'zustand'

const STORAGE_KEY = 'typing-time'
const INITIAL_TIME = 60

interface State {
  timerId: number
  totalTime: number
  leftTime: number
  start(): void
  reset(time?: number): void
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
  start: () => {
    const id = window.setInterval(() => {
      set(s => {
        if (s.leftTime === 1) clearInterval(id)

        return { leftTime: s.leftTime - 1 }
      })
    }, 1000)

    set({ timerId: id })
  },
  reset: time =>
    set(s => {
      if (time) setLocalTime(time)
      clearInterval(s.timerId)

      const totalTime = time || s.totalTime
      return { timerId: 0, leftTime: totalTime, totalTime }
    }),
}))
