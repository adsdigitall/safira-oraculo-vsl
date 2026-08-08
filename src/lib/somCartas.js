// ─────────────────────────────────────────────────────────────
//  Efeitos sonoros das cartas — sintetizados via Web Audio API.
//  Flip = "vvvv" (flutter grave com vibrato) + cristais "trin trin".
// ─────────────────────────────────────────────────────────────

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// Flutter grave "vvvv" — oscilador com tremolo rápido (LFO) e sweep.
function tocarFlutter(ac, agora) {
  const dur = 0.34;

  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, agora);
  osc.frequency.exponentialRampToValueAtTime(190, agora + dur);

  // LFO que "corta" o volume rapidamente = textura vvvv
  const lfo = ac.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(30, agora);
  lfo.frequency.linearRampToValueAtTime(46, agora + dur);
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.5;

  const filtro = ac.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.setValueAtTime(900, agora);
  filtro.frequency.exponentialRampToValueAtTime(2600, agora + dur * 0.6);
  filtro.Q.value = 4;

  const ganho = ac.createGain();
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(0.22, agora + 0.03);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + dur);

  // LFO modula o ganho (tremolo)
  lfo.connect(lfoGain).connect(ganho.gain);
  osc.connect(filtro).connect(ganho).connect(ac.destination);

  osc.start(agora);
  lfo.start(agora);
  osc.stop(agora + dur);
  lfo.stop(agora + dur);
}

// Cristais "trin trin trin" — pings de vidro agudos e curtos.
function tocarCristais(ac, agora) {
  const notas = [2489, 3136, 4186];
  notas.forEach((freq, i) => {
    const t = agora + 0.14 + i * 0.07;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const ganho = ac.createGain();
    ganho.gain.setValueAtTime(0.0001, t);
    ganho.gain.exponentialRampToValueAtTime(0.14 - i * 0.02, t + 0.01);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc.connect(ganho).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

export function tocarSomCarta() {
  try {
    const ac = getCtx();
    if (!ac) return;
    const agora = ac.currentTime;
    tocarFlutter(ac, agora);
    tocarCristais(ac, agora);
  } catch (e) {
    // Áudio indisponível — segue sem som.
  }
}
