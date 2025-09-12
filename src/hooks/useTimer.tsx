'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TimerState, 
  TimerSettings, 
  SessionData, 
  getNextState 
} from '@/lib/timerUtils';
import { audioManager, showNotification } from '@/lib/audioUtils';

export function useTimer(settings: TimerSettings) {
  const [sessionData, setSessionData] = useState<SessionData>({
    currentSession: 1,
    completedSessions: 0,
    currentState: 'idle',
    timeRemaining: settings.workDuration * 60,
    totalTimeForCurrentState: settings.workDuration * 60,
  });

  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Update timer when settings change
  useEffect(() => {
    if (sessionData.currentState === 'idle') {
      setSessionData(prev => ({
        ...prev,
        timeRemaining: settings.workDuration * 60,
        totalTimeForCurrentState: settings.workDuration * 60,
      }));
    }
  }, [settings.workDuration, sessionData.currentState]);

  // Get duration for current state
  const getDurationForState = useCallback((state: TimerState): number => {
    switch (state) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.workDuration * 60;
    }
  }, [settings]);

  // Start timer
  const start = useCallback(() => {
    if (sessionData.currentState === 'idle') {
      setSessionData(prev => ({
        ...prev,
        currentState: 'work',
        timeRemaining: settings.workDuration * 60,
        totalTimeForCurrentState: settings.workDuration * 60,
      }));
    }
    setIsRunning(true);
    lastTickRef.current = Date.now();
    
    if (settings.soundEnabled) {
      audioManager.playButtonClick();
    }
  }, [sessionData.currentState, settings.workDuration, settings.soundEnabled]);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
    if (settings.soundEnabled) {
      audioManager.playButtonClick();
    }
  }, [settings.soundEnabled]);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setSessionData({
      currentSession: 1,
      completedSessions: 0,
      currentState: 'idle',
      timeRemaining: settings.workDuration * 60,
      totalTimeForCurrentState: settings.workDuration * 60,
    });
    
    if (settings.soundEnabled) {
      audioManager.playButtonClick();
    }
  }, [settings.workDuration, settings.soundEnabled]);

  // Skip to next session
  const skip = useCallback(() => {
    const nextState = getNextState(
      sessionData.currentState,
      sessionData.currentSession,
      settings.sessionsBeforeLongBreak
    );
    
    const nextDuration = getDurationForState(nextState);
    const newSession = sessionData.currentState === 'work' 
      ? sessionData.currentSession + 1 
      : sessionData.currentSession;
    
    const newCompletedSessions = sessionData.currentState === 'work'
      ? sessionData.completedSessions + 1
      : sessionData.completedSessions;

    setSessionData({
      currentSession: newSession,
      completedSessions: newCompletedSessions,
      currentState: nextState,
      timeRemaining: nextDuration,
      totalTimeForCurrentState: nextDuration,
    });

    if (settings.soundEnabled) {
      audioManager.playButtonClick();
    }

    // Auto-start if enabled
    if ((nextState !== 'work' && settings.autoStartBreaks) || 
        (nextState === 'work' && settings.autoStartWork)) {
      setIsRunning(true);
      lastTickRef.current = Date.now();
    } else {
      setIsRunning(false);
    }
  }, [sessionData, settings, getDurationForState]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    const currentState = sessionData.currentState;
    const nextState = getNextState(
      currentState,
      sessionData.currentSession,
      settings.sessionsBeforeLongBreak
    );
    
    const nextDuration = getDurationForState(nextState);
    const newSession = currentState === 'work' 
      ? sessionData.currentSession + 1 
      : sessionData.currentSession;
    
    const newCompletedSessions = currentState === 'work'
      ? sessionData.completedSessions + 1
      : sessionData.completedSessions;

    // Play appropriate sound
    if (settings.soundEnabled) {
      switch (currentState) {
        case 'work':
          audioManager.playWorkComplete();
          break;
        case 'shortBreak':
        case 'longBreak':
          audioManager.playBreakComplete();
          break;
      }
    }

    // Show notification
    const messages = {
      work: {
        title: 'Work Session Complete!',
        body: nextState === 'longBreak' 
          ? 'Great job! Time for a long break.' 
          : 'Well done! Take a short break.',
      },
      shortBreak: {
        title: 'Break Complete!',
        body: 'Ready to get back to work?',
      },
      longBreak: {
        title: 'Long Break Complete!',
        body: 'Refreshed and ready for the next session!',
      },
    };

    const message = messages[currentState as keyof typeof messages];
    if (message) {
      showNotification(message.title, message.body);
    }

    // Update state
    setSessionData({
      currentSession: newSession,
      completedSessions: newCompletedSessions,
      currentState: nextState,
      timeRemaining: nextDuration,
      totalTimeForCurrentState: nextDuration,
    });

    // Auto-start next session if enabled
    if ((nextState !== 'work' && settings.autoStartBreaks) || 
        (nextState === 'work' && settings.autoStartWork)) {
      lastTickRef.current = Date.now();
      // Keep running
    } else {
      setIsRunning(false);
    }
  }, [sessionData, settings, getDurationForState]);

  // Timer effect
  useEffect(() => {
    if (isRunning && sessionData.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeDelta = Math.floor((now - lastTickRef.current) / 1000);
        
        if (timeDelta >= 1) {
          lastTickRef.current = now;
          
           setSessionData(prev => {
            const newTimeRemaining = Math.max(0, prev.timeRemaining - timeDelta);
            
            if (newTimeRemaining === 0) {
              // Timer completed
              setTimeout(handleTimerComplete, 50);
            }
            
            return {
              ...prev,
              timeRemaining: newTimeRemaining,
            };
          });
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, sessionData.timeRemaining, handleTimerComplete]);

  // Update document title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const minutes = Math.floor(sessionData.timeRemaining / 60);
      const seconds = sessionData.timeRemaining % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      if (sessionData.currentState !== 'idle') {
        const stateNames = {
          work: 'Focus',
          shortBreak: 'Break',
          longBreak: 'Long Break',
          paused: 'Paused',
        };
        const stateName = stateNames[sessionData.currentState as keyof typeof stateNames] || 'Timer';
        document.title = `${timeString} - ${stateName} | Pomodoro Timer`;
      } else {
        document.title = 'Pomodoro Timer - Focus & Productivity';
      }
    }
  }, [sessionData.timeRemaining, sessionData.currentState]);

  return {
    sessionData,
    isRunning,
    start,
    pause,
    reset,
    skip,
  };
}