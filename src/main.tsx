import { StrictMode } from 'react'
import { render } from 'react-dom'
import GlobalStyles from './globalStyles'
import App from './App'

render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
  document.getElementById('root'),
)
