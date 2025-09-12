export type TimerState = 'work' | 'shortBreak' | 'longBreak' | 'paused' | 'idle';

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

export interface SessionData {
  currentSession: number;
  completedSessions: number;
  currentState: TimerState;
  timeRemaining: number; // in seconds
  totalTimeForCurrentState: number; // in seconds
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
};

export const TIMER_PRESETS = {
  classic: {
    name: 'Classic Pomodoro',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  shortBurst: {
    name: 'Short Bursts',
    workDuration: 15,
    shortBreakDuration: 3,
    longBreakDuration: 10,
    sessionsBeforeLongBreak: 3,
  },
  longFocus: {
    name: 'Long Focus',
    workDuration: 45,
    shortBreakDuration: 10,
    longBreakDuration: 25,
    sessionsBeforeLongBreak: 3,
  },
  study: {
    name: 'Study Session',
    workDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 30,
    sessionsBeforeLongBreak: 2,
  },
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getNextState = (
  currentState: TimerState,
  currentSession: number,
  sessionsBeforeLongBreak: number
): TimerState => {
  switch (currentState) {
    case 'work':
      return currentSession % sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
    case 'shortBreak':
    case 'longBreak':
      return 'work';
    default:
      return 'work';
  }
};

export const getStateColor = (state: TimerState): string => {
  switch (state) {
    case 'work':
      return 'from-red-500 to-pink-500';
    case 'shortBreak':
      return 'from-green-500 to-emerald-500';
    case 'longBreak':
      return 'from-blue-500 to-indigo-500';
    case 'paused':
      return 'from-yellow-500 to-orange-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

export const getStateName = (state: TimerState): string => {
  switch (state) {
    case 'work':
      return 'Focus Time';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
    case 'paused':
      return 'Paused';
    default:
      return 'Ready';
  }
};

export const calculateProgress = (timeRemaining: number, totalTime: number): number => {
  if (totalTime === 0) return 0;
  return ((totalTime - timeRemaining) / totalTime) * 100;
};