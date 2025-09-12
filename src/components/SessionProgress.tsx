'use client';

import { TimerState } from '@/lib/timerUtils';

interface SessionProgressProps {
  currentSession: number;
  completedSessions: number;
  sessionsBeforeLongBreak: number;
  currentState: TimerState;
}

export function SessionProgress({
  currentSession,
  completedSessions,
  sessionsBeforeLongBreak,
  currentState,
}: SessionProgressProps) {
  const getSessionStatus = (sessionNumber: number) => {
    if (sessionNumber < currentSession) {
      return 'completed';
    } else if (sessionNumber === currentSession && currentState === 'work') {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const renderSessionDots = () => {
    const dots = [];
    for (let i = 1; i <= sessionsBeforeLongBreak; i++) {
      const status = getSessionStatus(i);
      dots.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
            status === 'completed'
              ? 'bg-green-500 border-green-500 shadow-green-200 shadow-lg'
              : status === 'active'
              ? 'bg-red-500 border-red-500 animate-pulse shadow-red-200 shadow-lg'
              : 'bg-gray-200 border-gray-300 hover:border-gray-400'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Session dots */}
      <div className="flex items-center space-x-3">
        {renderSessionDots()}
      </div>

      {/* Session counter */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800">
          {completedSessions}
          <span className="text-lg text-gray-500 ml-1">/ ∞</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Sessions Completed
        </div>
      </div>

      {/* Progress description */}
      <div className="text-center max-w-md">
        {currentState === 'idle' && (
          <p className="text-gray-600 text-sm">
            Ready to start your productivity session!
          </p>
        )}
        {currentState === 'work' && (
          <p className="text-gray-600 text-sm">
            Focus session {currentSession} of {sessionsBeforeLongBreak} before long break
          </p>
        )}
        {currentState === 'shortBreak' && (
          <p className="text-gray-600 text-sm">
            Take a short break - you've earned it!
          </p>
        )}
        {currentState === 'longBreak' && (
          <p className="text-gray-600 text-sm">
            Enjoy your long break - great work on completing {sessionsBeforeLongBreak} sessions!
          </p>
        )}
        {currentState === 'paused' && (
          <p className="text-gray-600 text-sm">
            Timer paused - resume when you're ready
          </p>
        )}
      </div>

      {/* Long break indicator */}
      {currentSession % sessionsBeforeLongBreak === 0 && currentSession > 0 && currentState !== 'idle' && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {currentState === 'longBreak' 
                  ? 'Long break in progress!' 
                  : 'Next break will be a long break!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement display */}
      {completedSessions > 0 && completedSessions % 10 === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                🎉 Milestone reached: {completedSessions} sessions completed!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}