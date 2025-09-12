'use client';

import { Button } from '@/components/ui/button';
import { TimerState } from '@/lib/timerUtils';

interface TimerControlsProps {
  currentState: TimerState;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  currentState,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const getButtonColor = (state: TimerState) => {
    switch (state) {
      case 'work':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'shortBreak':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'longBreak':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const primaryButtonColor = getButtonColor(currentState);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
      {/* Primary control button */}
      <Button
        onClick={isRunning ? onPause : onStart}
        size="lg"
        className={`px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[120px] ${primaryButtonColor} shadow-lg hover:shadow-xl`}
      >
        {isRunning ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex gap-1">
              <div className="w-1.5 h-4 bg-current rounded"></div>
              <div className="w-1.5 h-4 bg-current rounded"></div>
            </div>
            Pause
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative">
              <div 
                className="w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-current"
                style={{ 
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'currentColor'
                }}
              />
            </div>
            {currentState === 'idle' ? 'Start' : 'Resume'}
          </div>
        )}
      </Button>

      {/* Secondary controls */}
      <div className="flex gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border-2 hover:border-gray-400"
          disabled={currentState === 'idle' && !isRunning}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current rounded-full relative">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-1 border-r-1 border-b-2 border-current"></div>
            </div>
            Reset
          </div>
        </Button>

        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          className="px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border-2 hover:border-gray-400"
          disabled={currentState === 'idle'}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center">
              <div 
                className="w-0 h-0 border-l-3 border-r-0 border-t-2 border-b-2 border-current mr-0.5"
                style={{ 
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'currentColor'
                }}
              />
              <div className="w-0.5 h-4 bg-current"></div>
            </div>
            Skip
          </div>
        </Button>
      </div>

      {/* Mobile layout adjustment */}
      <style jsx>{`
        @media (max-width: 640px) {
          .flex-wrap {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}