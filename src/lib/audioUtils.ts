class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    }
  }

  private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const localGainNode = this.audioContext.createGain();

    oscillator.connect(localGainNode);
    localGainNode.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    localGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    localGainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    localGainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playWorkComplete(): void {
    this.initAudioContext();
    // Pleasant ascending chime for work completion
    setTimeout(() => this.createBeep(523.25, 0.2), 0);    // C5
    setTimeout(() => this.createBeep(659.25, 0.2), 200);  // E5
    setTimeout(() => this.createBeep(783.99, 0.3), 400);  // G5
  }

  playBreakComplete(): void {
    this.initAudioContext();
    // Gentle notification for break completion
    setTimeout(() => this.createBeep(440, 0.15), 0);      // A4
    setTimeout(() => this.createBeep(554.37, 0.15), 150); // C#5
    setTimeout(() => this.createBeep(659.25, 0.25), 300); // E5
  }

  playSessionComplete(): void {
    this.initAudioContext();
    // Celebratory sequence for completing all sessions
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 0.2), index * 150);
    });
    // Final chord
    setTimeout(() => {
      this.createBeep(523.25, 0.5);
      this.createBeep(659.25, 0.5);
      this.createBeep(783.99, 0.5);
    }, 800);
  }

  playButtonClick(): void {
    this.initAudioContext();
    // Subtle click sound for UI interactions
    this.createBeep(800, 0.05, 'square');
  }

   playTick(): void {
    this.initAudioContext();
    // Very subtle tick for each second (if enabled)
    this.createBeep(1000, 0.02, 'square');
  }

  // Test if audio can be played (user gesture required)
  async testAudio(): Promise<boolean> {
    try {
      this.initAudioContext();
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      return this.audioContext?.state === 'running';
    } catch (error) {
      console.warn('Audio not available:', error);
      return false;
    }
  }

  // Cleanup method
  cleanup(): void {
    if (this.audioContext?.state !== 'closed') {
      this.audioContext?.close();
    }
    this.audioContext = null;
    this.gainNode = null;
  }
}

// Singleton instance
export const audioManager = new AudioManager();

// Notification API fallback for browsers that support it
export const showNotification = (title: string, body: string, icon?: string): void => {
  if (typeof window === 'undefined') return;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      silent: false,
      tag: 'pomodoro-timer',
    });
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};