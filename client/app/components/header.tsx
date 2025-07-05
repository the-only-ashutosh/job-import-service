'use client';

import { ModeToggle } from '@/app/components/mode-toggle';
import { Database, TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/50 dark:bg-slate-900/80 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm transition-colors duration-300">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Job Import Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                History & Analytics
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Real-time monitoring</span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}