import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun, UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';

const queryClient = new QueryClient();

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const { theme, setTheme } = useTheme();

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername(username);
      setShowLogin(false);
    } else {
      console.log('Invalid credentials');
      // You might want to show an error message to the user here
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
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/cedefiai-logo.svg" alt="CeDeFiAi Logo" className="h-12 w-12 mr-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">CeDeFiAi Crypto Asset Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-foreground hidden md:inline">Welcome, {username}</span>
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
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
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
