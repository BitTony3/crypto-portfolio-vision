import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomizableDashboard from '../components/CustomizableDashboard';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserIcon, Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '../integrations/supabase';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const Index = () => {
  const auth = useSupabaseAuth();
  const session = auth?.session;
  const signOut = auth?.signOut;
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const [showMatrixRain, setShowMatrixRain] = useState(true);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    };
    handleBodyOverflow();
    
    const timer = setTimeout(() => {
      setShowMatrixRain(false);
    }, 5000);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [isMobileMenuOpen]);

  const MatrixRain = useCallback(() => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-px h-px bg-primary animate-matrixRain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>
    );
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const memoizedDashboard = useMemo(() => <CustomizableDashboard />, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen bg-gradient-to-br from-background to-secondary text-foreground font-sans ${!showMatrixRain ? 'animate-fadeIn' : ''}`}>
        <AnimatePresence>
          {showMatrixRain && <MatrixRain key="matrix-rain" />}
        </AnimatePresence>
        <header className="bg-card/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <motion.img 
              src="/crypto-logo.svg" 
              alt="Crypto Logo" 
              className="h-10 w-10 cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/profile">
                          <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300">
                            <UserIcon className="mr-1 h-4 w-4" /> Profile
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>View your profile</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-primary hover:text-primary/80 transition-colors duration-300">
                          <LogOut className="mr-1 h-4 w-4" /> Logout
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sign out of your account</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <Button onClick={() => setShowLogin(true)} variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300">Login</Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-card/50 p-1 rounded-full">
                      <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        className="bg-primary/20 dark:bg-primary/40"
                      />
                      <Moon className="h-4 w-4 text-primary dark:text-primary-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Toggle theme</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="md:hidden">
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              key="mobile-menu"
              className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {session ? (
                  <>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" onClick={toggleMobileMenu} className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300">
                        <UserIcon className="mr-1 h-4 w-4" /> Profile
                      </Button>
                    </Link>
                    <Button onClick={() => { handleLogout(); toggleMobileMenu(); }} variant="ghost" size="sm" className="text-primary hover:text-primary/80 transition-colors duration-300">
                      <LogOut className="mr-1 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => { setShowLogin(true); toggleMobileMenu(); }} variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300">Login</Button>
                )}
                <div className="flex items-center space-x-2 bg-card/50 p-1 rounded-full">
                  <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="bg-primary/20 dark:bg-primary/40"
                  />
                  <Moon className="h-4 w-4 text-primary dark:text-primary-foreground" />
                </div>
                <Button onClick={toggleMobileMenu} variant="ghost" size="sm" className="text-primary hover:text-primary/80 transition-colors duration-300">Close Menu</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {showLogin && !session ? (
              <motion.div
                key="login-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50"
              >
                <Login onClose={() => setShowLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CustomizableDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;