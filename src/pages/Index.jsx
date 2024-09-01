import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomizableDashboard from '../components/CustomizableDashboard';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserIcon, Menu, LayoutDashboard, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '../integrations/supabase';
import { Switch } from "@/components/ui/switch";

const queryClient = new QueryClient();

const Index = () => {
  const auth = useSupabaseAuth();
  const session = auth?.session;
  const signOut = auth?.signOut;
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const [showMatrixRain, setShowMatrixRain] = useState(true);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = isMobileMenuOpen || isLeftMenuOpen ? 'hidden' : 'unset';
    };
    handleBodyOverflow();
    
    const timer = setTimeout(() => {
      setShowMatrixRain(false);
    }, 5000);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [isMobileMenuOpen, isLeftMenuOpen]);

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

  const toggleLeftMenu = useCallback(() => {
    setIsLeftMenuOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const memoizedDashboard = useMemo(() => <CustomizableDashboard />, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen bg-gradient-light dark:bg-gradient-dark text-foreground-light dark:text-foreground-dark font-sans ${!showMatrixRain ? 'animate-fadeIn' : ''} lightning-effect`}>
        <AnimatePresence>
          {showMatrixRain && <MatrixRain key="matrix-rain" />}
        </AnimatePresence>
        <header className="bg-card shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <motion.img 
              src="/crypto-logo.svg" 
              alt="Crypto Logo" 
              className="h-8 w-8 cursor-pointer"
              onClick={toggleLeftMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                      <UserIcon className="mr-1 h-3 w-3" /> Profile
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">Logout</Button>
                </>
              ) : (
                <Button onClick={() => setShowLogin(true)} variant="default" size="sm" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Login</Button>
              )}
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="bg-blue-200 dark:bg-blue-700"
                />
                <Moon className="h-4 w-4 text-blue-800 dark:text-blue-200" />
              </div>
            </div>
            <div className="md:hidden">
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 dark:text-blue-300"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <AnimatePresence>
          {isLeftMenuOpen && (
            <motion.div 
              key="left-menu"
              className="fixed inset-y-0 left-0 w-64 bg-blue-50 dark:bg-blue-900 shadow-lg z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="p-4 space-y-4">
                <Button variant="ghost" className="w-full justify-start text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800" onClick={toggleLeftMenu}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Main Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800" onClick={toggleLeftMenu}>
                  <User className="mr-2 h-4 w-4" /> Personal Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              key="mobile-menu"
              className="fixed inset-0 bg-blue-50/95 dark:bg-blue-900/95 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {session ? (
                  <>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" onClick={toggleMobileMenu} className="bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-700">
                        <UserIcon className="mr-1 h-3 w-3" /> Profile
                      </Button>
                    </Link>
                    <Button onClick={() => { handleLogout(); toggleMobileMenu(); }} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">Logout</Button>
                  </>
                ) : (
                  <Button onClick={() => { setShowLogin(true); toggleMobileMenu(); }} variant="default" size="sm" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Login</Button>
                )}
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="bg-blue-200 dark:bg-blue-700"
                  />
                  <Moon className="h-4 w-4 text-blue-800 dark:text-blue-200" />
                </div>
                <Button onClick={toggleMobileMenu} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">Close Menu</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="container mx-auto px-2 py-4">
          <AnimatePresence mode="wait">
            {showLogin && !session ? (
              <motion.div
                key="login-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-blue-50/80 dark:bg-blue-900/80 backdrop-blur-sm flex justify-center items-center z-50"
              >
                <Login onClose={() => setShowLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
