
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeGlobalErrorHandling } from './utils/globalErrorHandler'

// Initialiser la gestion globale des erreurs
initializeGlobalErrorHandling();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
