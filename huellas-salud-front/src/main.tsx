import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import App from './App.tsx'
import { CartProvider } from './modules/Cart/context/CartContext.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
)
