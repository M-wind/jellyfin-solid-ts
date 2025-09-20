/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'

import App from './App'
import { AppProvider } from './context/AppContext'

const app = document.getElementById('YXBw')

render(
  () => (
    <AppProvider>
      <App />
    </AppProvider>
  ),
  app!,
)
