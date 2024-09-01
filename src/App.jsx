import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from 'react-error-boundary';
import { SupabaseAuthProvider } from './integrations/supabase';
import Index from './pages/Index';

const queryClient = new QueryClient();

const ErrorFallback = ({ error }) => (
  <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong:</h2>
    <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
  </div>
);

const App = () => (
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Index />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default App;
