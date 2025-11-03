class SoundManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }

  click() {
    this.playTone(800, 0.04, "sine", 0.2);
  }

  hover() {
    this.playTone(600, 0.05, "sine", 0.15);
  }

  pop() {
    this.playTone(1000, 0.1, "sine", 0.25);
    setTimeout(() => this.playTone(1200, 0.08, "sine", 0.15), 50);
  }

  whoosh() {
    const ctx = this.getContext();
    const startFreq = 200;
    const endFreq = 800;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.05);
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }

  bloom() {
    this.playTone(400, 0.2, "sine", 0.2);
    setTimeout(() => this.playTone(600, 0.15, "sine", 0.15), 100);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
