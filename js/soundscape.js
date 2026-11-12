// Ambient Water & Nature Sound Generator using Web Audio API
// Generates relaxing cascading waterfall & water ripples procedurally without external audio assets.

class NatureSoundscape {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.noiseNode = null;
    this.gainNode = null;
    this.filterNode = null;
    this.birdTimer = null;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // Waterfall pink/brown noise generator buffer (5 seconds looping)
    const bufferSize = this.audioCtx.sampleRate * 4;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate pink noise approximation (natural rushing water)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    this.waterBuffer = noiseBuffer;
  }

  start() {
    if (this.isPlaying) return;
    this.init();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Create noise source
    this.noiseNode = this.audioCtx.createBufferSource();
    this.noiseNode.buffer = this.waterBuffer;
    this.noiseNode.loop = true;

    // Lowpass filter to simulate deep cascading water sound
    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    // Master volume gain
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.35, this.audioCtx.currentTime + 2.5);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.noiseNode.start();
    this.isPlaying = true;

    // Start occasional birdsong chirps
    this.scheduleBirdChirp();
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.gainNode) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.0);
      setTimeout(() => {
        if (this.noiseNode) {
          try { this.noiseNode.stop(); } catch(e){}
          this.noiseNode.disconnect();
        }
        this.isPlaying = false;
      }, 1000);
    }
    if (this.birdTimer) clearTimeout(this.birdTimer);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  scheduleBirdChirp() {
    if (!this.isPlaying) return;
    const nextInterval = 4000 + Math.random() * 8000;
    this.birdTimer = setTimeout(() => {
      this.playBirdChirp();
      this.scheduleBirdChirp();
    }, nextInterval);
  }

  playBirdChirp() {
    if (!this.isPlaying || !this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const chirpGain = this.audioCtx.createGain();

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, this.audioCtx.currentTime + 0.22);

    chirpGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    chirpGain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.05);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

    osc.connect(chirpGain);
    chirpGain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.26);
  }
}

window.NatureSoundscape = NatureSoundscape;
