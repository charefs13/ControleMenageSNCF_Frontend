import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';  
// index.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS pour les composants interactifs (modals, dropdowns...)



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
