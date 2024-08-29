import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopCryptoAssets from '../components/TopCryptoAssets';
import Portfolio from '../components/Portfolio';
import Login from '../components/Login';
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username, password) => {
    // Here you would typically validate the credentials
    console.log('Logging in with:', username, password);
    setIsLoggedIn(true);
    setUsername(username);
    setShowLogin(false);
  };

  const handleSignUp = (username, password) => {
    // Here you would typically create a new account
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
      <div className="min-h-screen bg-black p-8 font-mono text-off-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-6xl font-bold text-neon-blue border-4 border-neon-blue p-4 inline-block shadow-[0_0_10px_#00FFFF]">Crypto Asset Tracker</h1>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-neon-blue">Welcome, {username}</span>
              <Button onClick={handleLogout} className="bg-neon-blue text-black hover:bg-blue-400">Logout</Button>
            </div>
          ) : (
            <Button onClick={() => setShowLogin(true)} className="bg-neon-blue text-black hover:bg-blue-400">Login</Button>
          )}
        </div>
        {showLogin && !isLoggedIn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Login onLogin={handleLogin} onSignUp={handleSignUp} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
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
