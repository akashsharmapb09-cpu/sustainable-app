'use client';

import { useEffect, useState } from 'react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/queryClient';
import { convex } from './shared/lib/convex';
import { AuthProvider } from './features/auth';
import { AssistantWidget, ToastProvider } from './shared/ui';
import App from './App';

export default function ClientRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F0E8',
          fontFamily: "'DM Sans', sans-serif",
          color: '#162a20',
        }}
      >
        <p style={{ fontWeight: 600, fontSize: '1rem' }}>Loading GreenSwap...</p>
      </div>
    );
  }

  return (
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
  );
}
