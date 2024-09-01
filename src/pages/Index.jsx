import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserIcon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const queryClient = new QueryClient();

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

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
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <motion.img 
                src="/cedefiai-logo.svg" 
                alt="CeDeFiAi Logo" 
                className="h-10 w-10 mr-3"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h1 
                className="text-xl md:text-2xl font-bold text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                CeDeFiAi Crypto Tracker
              </motion.h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-foreground">Welcome, {username}</span>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <UserIcon className="mr-2 h-4 w-4" /> Profile
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
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <div className="md:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {isLoggedIn ? (
                <>
                  <span className="text-foreground">Welcome, {username}</span>
                  <Link to="/profile">
                    <Button variant="outline" size="lg" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserIcon className="mr-2 h-5 w-5" /> Profile
                    </Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="ghost" size="lg">Logout</Button>
                </>
              ) : (
                <Button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} variant="default" size="lg">Login</Button>
              )}
              <Button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                variant="ghost"
                size="lg"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6 mr-2" /> : <Moon className="h-6 w-6 mr-2" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button onClick={() => setIsMobileMenuOpen(false)} variant="ghost" size="lg">Close Menu</Button>
            </div>
          </motion.div>
        )}
        <main className="container mx-auto px-4 py-6">
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
