'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { SessionProgress } from '@/components/SessionProgress';
import { SettingsModal } from '@/components/SettingsModal';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TimerSettings, DEFAULT_SETTINGS } from '@/lib/timerUtils';
import { requestNotificationPermission } from '@/lib/audioUtils';

export function PomodoroTimer() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('pomodoro-settings', DEFAULT_SETTINGS);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  const { sessionData, isRunning, start, pause, reset, skip } = useTimer(settings);

  // Request notification permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
    };
    checkPermission();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if ((event.target as HTMLElement)?.tagName === 'INPUT') return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isRunning) {
            pause();
          } else {
            start();
          }
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            reset();
          }
          break;
        case 'KeyS':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            skip();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, start, pause, reset, skip]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - could pause if needed
      } else {
        // Tab became visible - could resume if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pomodoro Timer</h1>
          <p className="text-gray-600 text-sm mt-1">Focus • Work • Achieve</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notification permission indicator */}
          {notificationPermission === 'denied' && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Notifications disabled
            </div>
          )}
          
          {/* Settings button */}
          <SettingsModal settings={settings} onSettingsChange={setSettings}>
            <Button variant="outline" className="rounded-full px-4">
              <div className="w-5 h-5 mr-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              Settings
            </Button>
          </SettingsModal>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
           {/* Timer display */}
          <TimerDisplay
            timeRemaining={sessionData.timeRemaining}
            totalTime={sessionData.totalTimeForCurrentState}
            currentState={sessionData.currentState}
            isRunning={isRunning}
          />

          {/* Timer controls */}
          <TimerControls
            currentState={sessionData.currentState}
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSkip={skip}
          />

          {/* Session progress */}
          <SessionProgress
            currentSession={sessionData.currentSession}
            completedSessions={sessionData.completedSessions}
            sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
            currentState={sessionData.currentState}
          />
        </div>
      </main>

      {/* Footer with keyboard shortcuts */}
      <footer className="p-6 text-center">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Keyboard shortcuts: Space (play/pause), Ctrl+R (reset), Ctrl+S (skip)</div>
          <div className="opacity-75">Built with ❤️ for productivity</div>
        </div>
      </footer>
    </div>
  );
}