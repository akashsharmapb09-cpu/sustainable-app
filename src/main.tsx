import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/queryClient';
import { convex } from './shared/lib/convex';
import { AuthProvider } from './features/auth';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConvexAuthProvider client={convex}>
          <AuthProvider>
            <ToastProvider>
              <App />
              <AssistantWidget />
            </ToastProvider>
          </AuthProvider>
        </ConvexAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
