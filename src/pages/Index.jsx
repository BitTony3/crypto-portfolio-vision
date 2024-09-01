import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserIcon, Menu, LayoutDashboard, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || isLeftMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen, isLeftMenuOpen]);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername(username);
      setShowLogin(false);
    } else {
      console.log('Invalid credentials');
    }
  };

  const handleSignUp = (username, password) => {
    console.log('Signing up with:', username, password);
    setIsLoggedIn(true);
    setUsername(username);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <header className="bg-card shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <motion.img 
              src="/crypto-logo.svg" 
              alt="Crypto Logo" 
              className="h-8 w-8 cursor-pointer"
              onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <UserIcon className="mr-1 h-3 w-3" /> Profile
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm">Logout</Button>
                </>
              ) : (
                <Button onClick={() => setShowLogin(true)} variant="default" size="sm">Login</Button>
              )}
              <Button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="md:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
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
              className="fixed inset-y-0 left-0 w-64 bg-card shadow-lg z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="p-4 space-y-4">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsLeftMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Main Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsLeftMenuOpen(false); }}>
                  <User className="mr-2 h-4 w-4" /> Personal Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserIcon className="mr-1 h-3 w-3" /> Profile
                      </Button>
                    </Link>
                    <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="ghost" size="sm">Logout</Button>
                  </>
                ) : (
                  <Button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} variant="default" size="sm">Login</Button>
                )}
                <Button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  variant="ghost"
                  size="sm"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button onClick={() => setIsMobileMenuOpen(false)} variant="ghost" size="sm">Close Menu</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="container mx-auto px-2 py-4">
          {showLogin && !isLoggedIn && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50">
              <Login onLogin={handleLogin} onSignUp={handleSignUp} onClose={() => setShowLogin(false)} />
            </div>
          )}
          <Dashboard />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
