import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/nunito/index.css'
import './styles/index.css'
import App from './App'
import { BloomProvider } from './state/BloomStore'
import { TimerProvider } from './state/TimerStore'
import { ToastProvider } from './components/ui'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BloomProvider>
      <TimerProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </TimerProvider>
    </BloomProvider>
  </StrictMode>,
)
