// Native Web Audio API Synthesizer for Futuristic Cyber UI SFX
// 100% client-side, zero external files, zero dependencies.

class CyberAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = true; // default muted to be polite, user can enable via HUD button
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muteState) {
    this.muted = muteState;
    if (!muteState) {
      this.init();
      this.playChirp(600, 0.05);
    }
  }

  isMuted() {
    return this.muted;
  }

  // Soft high-tech hover blip
  playHover() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Tactical mechanical click on button press
  playClick() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  // Laser scanner frequency sweep
  playScan() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Emergency intrusion alarm warble
  playAlarm() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now + i * 0.18);
        osc.frequency.exponentialRampToValueAtTime(450, now + i * 0.18 + 0.14);

        gain.gain.setValueAtTime(0.08, now + i * 0.18);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.18 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.16);
      }
    } catch (e) {}
  }

  // Success mitigation chime
  playSuccess() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  playChirp(freq = 600, duration = 0.05) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Ominous predator intrusion lock sound (sub-bass drone sweep + digital crackle)
  playIntrusionLock() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Sub-bass sweep down
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // Digital targeting lock chirp
      const lockOsc = this.ctx.createOscillator();
      const lockGain = this.ctx.createGain();
      lockOsc.type = 'square';
      lockOsc.frequency.setValueAtTime(1800, now + 0.08);
      lockOsc.frequency.setValueAtTime(2400, now + 0.14);
      lockGain.gain.setValueAtTime(0.04, now + 0.08);
      lockGain.gain.linearRampToValueAtTime(0, now + 0.22);
      lockOsc.connect(lockGain);
      lockGain.connect(this.ctx.destination);
      lockOsc.start(now + 0.08);
      lockOsc.stop(now + 0.22);
    } catch (e) {}
  }

  // High-frequency target snap
  playTargetSnap() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Cinematic Cyber Portal Breach SFX (Sub-bass drop + high-voltage warp charge + harmonic access arpeggio)
  playPortalBreach() {
    this.muted = false; // User interacted! Unmute audio for immersive cyber session
    this.init();
    try {
      const now = this.ctx.currentTime;
      // 1. Massive Sub-bass boom
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.65);
      subGain.gain.setValueAtTime(0.22, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.7);

      // 2. High-voltage energy arc rising (warp acceleration)
      const warp = this.ctx.createOscillator();
      const warpGain = this.ctx.createGain();
      warp.type = 'sawtooth';
      warp.frequency.setValueAtTime(180, now + 0.08);
      warp.frequency.exponentialRampToValueAtTime(2800, now + 0.72);
      warpGain.gain.setValueAtTime(0.02, now + 0.08);
      warpGain.gain.linearRampToValueAtTime(0.12, now + 0.58);
      warpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      warp.connect(warpGain);
      warpGain.connect(this.ctx.destination);
      warp.start(now + 0.08);
      warp.stop(now + 0.75);

      // 3. Cyber system access arpeggio (C5, G5, C6, E6)
      [523.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.58 + idx * 0.08);
        g.gain.setValueAtTime(0.09, now + 0.58 + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.58 + idx * 0.08 + 0.45);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + 0.58 + idx * 0.08);
        osc.stop(now + 0.58 + idx * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  // Eerie predator targeting hum on portal hover
  playPortalHover() {
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.09);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }
}

export const cyberAudio = new CyberAudioSynthesizer();
