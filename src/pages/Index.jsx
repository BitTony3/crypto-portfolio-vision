import React, { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Portfolio from '../components/Portfolio';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary text-foreground font-sans">
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
        <main className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] md:h-auto">
          <Portfolio />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Index;