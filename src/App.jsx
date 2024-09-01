import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { navItems } from "./nav-items";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

const ErrorFallback = ({ error }) => (
  <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong:</h2>
    <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
  </div>
);

const AppContent = () => (
  <>
    <ScrollToTop />
    <Routes>
      {navItems.map(({ to, page }) => (
        <Route key={to} path={to} element={page} />
      ))}
    </Routes>
  </>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
