import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from '@/routes/AppRoutes';
import { getQueryClient } from '@/hooks/useQueryClient';
import './styles/index.css';

const queryClient = getQueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
);
