// ─────────────────────────────────────────────────────────────
//  Efeito sonoro das cartas — sintetizado via Web Audio API.
//  Flutter de papel + batida grave de ressonância + brilho de cristais.
//  Otimizado para ser claramente audível em qualquer celular/alto-falante.
// ─────────────────────────────────────────────────────────────

let ctx = null;

export function prepararAudio() {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch (e) {
    return null;
  }
}

export function tocarSomCarta() {
  try {
    const ac = prepararAudio();
    if (!ac) return;
    const agora = ac.currentTime;

    // 1. Textura de deslize de papel (Ruído rosa/branco filtrado com sweep)
    const bufferSize = ac.sampleRate * 0.22;
    const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSrc = ac.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, agora);
    noiseFilter.frequency.exponentialRampToValueAtTime(2400, agora + 0.18);
    noiseFilter.Q.value = 2.5;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.0001, agora);
    noiseGain.gain.exponentialRampToValueAtTime(0.35, agora + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, agora + 0.2);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ac.destination);
    noiseSrc.start(agora);

    // 2. Corpo do flip (Sweep de triângulo audível 240Hz -> 480Hz)
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, agora);
    osc.frequency.exponentialRampToValueAtTime(440, agora + 0.24);

    const bodyFilter = ac.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(1400, agora);
    bodyFilter.Q.value = 1.2;

    const bodyGain = ac.createGain();
    bodyGain.gain.setValueAtTime(0.0001, agora);
    bodyGain.gain.exponentialRampToValueAtTime(0.45, agora + 0.02);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, agora + 0.28);

    osc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(ac.destination);
    osc.start(agora);
    osc.stop(agora + 0.28);

    // 3. Brilho místico de cristais ("trin-trin" sutil e harmonioso)
    const freqs = [1318.5, 1760.0, 2349.3, 3135.9]; // E6, A6, D7, G7
    freqs.forEach((freq, idx) => {
      const delay = 0.06 + idx * 0.04;
      const t = agora + delay;

      const cOsc = ac.createOscillator();
      cOsc.type = 'sine';
      cOsc.frequency.setValueAtTime(freq, t);

      const cGain = ac.createGain();
      cGain.gain.setValueAtTime(0.0001, t);
      cGain.gain.exponentialRampToValueAtTime(0.18 - idx * 0.03, t + 0.012);
      cGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      cOsc.connect(cGain);
      cGain.connect(ac.destination);
      cOsc.start(t);
      cOsc.stop(t + 0.24);
    });

    // 4. Vibração tátil no celular (se suportado)
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([25, 40, 25]);
      }
    } catch (e) {}
  } catch (e) {
    // Áudio indisponível — descarte silencioso
  }
}

