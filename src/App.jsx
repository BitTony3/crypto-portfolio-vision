import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { navItems } from "./nav-items";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

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
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
