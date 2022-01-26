import useTimer from 'hooks/useTimer'

import Header from 'components/Header/Header'
import Challenge from 'views/Challenge/Challenge'
import Results from 'views/Results/Results'

export default function App() {
  const timeEnd = useTimer(s => s.leftTime === 0)

  return (
    <>
      <Header />
      {timeEnd ? <Results /> : <Challenge />}
    </>
  )
}
