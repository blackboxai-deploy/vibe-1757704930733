'use client';

import { TimerState } from '@/lib/timerUtils';
import { formatTime, calculateProgress, getStateColor } from '@/lib/timerUtils';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  currentState: TimerState;
  isRunning: boolean;
}

export function TimerDisplay({ timeRemaining, totalTime, currentState, isRunning }: TimerDisplayProps) {
  const progress = calculateProgress(timeRemaining, totalTime);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const gradientColor = getStateColor(currentState);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background gradient */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientColor} opacity-10 blur-3xl scale-150 transition-all duration-1000`} />
      
      {/* SVG Progress Ring */}
      <div className="relative">
        <svg
          className="transform -rotate-90 transition-all duration-300"
          width="280"
          height="280"
          viewBox="0 0 280 280"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: isRunning ? 'drop-shadow(0 0 8px currentColor)' : 'none',
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" className={`text-red-500 ${currentState === 'work' ? 'text-red-500' : currentState === 'shortBreak' ? 'text-green-500' : currentState === 'longBreak' ? 'text-blue-500' : 'text-gray-500'}`} />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" className={`text-pink-500 ${currentState === 'work' ? 'text-pink-500' : currentState === 'shortBreak' ? 'text-emerald-500' : currentState === 'longBreak' ? 'text-indigo-500' : 'text-slate-500'}`} />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className={`text-6xl font-bold font-mono tracking-tight transition-all duration-300 ${
                isRunning ? 'scale-105' : 'scale-100'
              } ${
                currentState === 'work' 
                  ? 'text-red-600' 
                  : currentState === 'shortBreak' 
                  ? 'text-green-600'
                  : currentState === 'longBreak'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
            
            {/* State indicator */}
            <div className={`mt-2 text-sm font-medium transition-colors duration-300 ${
              currentState === 'work' 
                ? 'text-red-500' 
                : currentState === 'shortBreak' 
                ? 'text-green-500'
                : currentState === 'longBreak'
                ? 'text-blue-500'
                : 'text-gray-500'
            }`}>
              {currentState === 'work' && 'Focus Time'}
              {currentState === 'shortBreak' && 'Short Break'}
              {currentState === 'longBreak' && 'Long Break'}
              {currentState === 'paused' && 'Paused'}
              {currentState === 'idle' && 'Ready to Start'}
            </div>

            {/* Running indicator */}
            {isRunning && (
              <div className="mt-3 flex justify-center">
                <div className={`h-2 w-2 rounded-full animate-pulse ${
                  currentState === 'work' 
                    ? 'bg-red-500' 
                    : currentState === 'shortBreak' 
                    ? 'bg-green-500'
                    : currentState === 'longBreak'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
                }`} />
              </div>
            )}
          </div>
        </div>

        {/* Pulse animation when running */}
        {isRunning && (
          <div className={`absolute inset-0 rounded-full animate-ping ${
            currentState === 'work' 
              ? 'bg-red-500' 
              : currentState === 'shortBreak' 
              ? 'bg-green-500'
              : currentState === 'longBreak'
              ? 'bg-blue-500'
              : 'bg-gray-500'
          } opacity-20`} 
          style={{ animationDuration: '3s' }} />
        )}
      </div>
    </div>
  );
}