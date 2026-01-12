import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes'
import { AuthProvider } from './context/AuthContext'
import { AudioProvider } from './context/AudioContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AudioProvider>
        <AppRoutes />
      </AudioProvider>
    </AuthProvider>
  </StrictMode>,
)
