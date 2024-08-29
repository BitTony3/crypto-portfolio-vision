import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopCryptoAssets from '../components/TopCryptoAssets';
import Portfolio from '../components/Portfolio';
import Login from '../components/Login';
import MiniGames from '../components/MiniGames';
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username, password) => {
    console.log('Logging in with:', username, password);
    setIsLoggedIn(true);
    setUsername(username);
    setShowLogin(false);
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
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-primary">Welcome, {username}</span>
              <Button onClick={handleLogout} className="bg-primary text-secondary hover:bg-accent">Logout</Button>
            </div>
          ) : (
            <Button onClick={() => setShowLogin(true)} className="bg-primary text-secondary hover:bg-accent">Login</Button>
          )}
        </div>
        {showLogin && !isLoggedIn && (
          <div className="fixed inset-0 bg-background bg-opacity-50 flex justify-center items-center">
            <Login onLogin={handleLogin} onSignUp={handleSignUp} onClose={() => setShowLogin(false)} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <MiniGames />
            <TopCryptoAssets />
          </div>
          <div className="md:order-1">
            <Portfolio />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
