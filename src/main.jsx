import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ViajeProvider } from './context/ViajeContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ViajeProvider>
        <App />
      </ViajeProvider>
    </BrowserRouter>
  </StrictMode>
);
