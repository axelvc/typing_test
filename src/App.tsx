import useTimer from './hooks/useTimer'

import Challenge from './components/Challenge/Challenge'
import Header from './components/Header/Header'
import Results from './components/Results/Results'

export default function App() {
  const timeEnd = useTimer(s => s.leftTime === 0)

  return (
    <>
      <Header />
      {timeEnd ? <Results /> : <Challenge />}
    </>
  )
}
