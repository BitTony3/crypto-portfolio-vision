import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopCryptoAssets from '../components/TopCryptoAssets';
import Portfolio from '../components/Portfolio';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

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
      <div className="min-h-screen bg-background p-8 font-sans text-text">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src="/cedefiai-logo.svg" alt="CeDeFiAi Logo" className="h-16 w-16 mr-4" />
            <h1 className="text-4xl font-bold text-primary">CeDeFiAi Crypto Asset Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-primary">Welcome, {username}</span>
                <Button onClick={handleLogout} className="bg-primary text-secondary hover:bg-accent">Logout</Button>
              </>
            ) : (
              <Button onClick={() => setShowLogin(true)} className="bg-primary text-secondary hover:bg-accent">Login</Button>
            )}
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {showLogin && !isLoggedIn && (
          <div className="fixed inset-0 bg-background bg-opacity-50 flex justify-center items-center z-50">
            <Login onLogin={handleLogin} onSignUp={handleSignUp} onClose={() => setShowLogin(false)} />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Portfolio />
          </div>
          <div>
            <TopCryptoAssets />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
