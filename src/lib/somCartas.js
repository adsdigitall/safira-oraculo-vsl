// ─────────────────────────────────────────────────────────────
//  Efeito sonoro das cartas — sintetizado via Web Audio API.
//  Vibração: grave abafado com tremolo, tipo celular vibrando na
//  mesa. Curto e discreto — não é um "efeito", é uma resposta ao
//  toque. Sem os agudos de vidro, que ficavam ásperos no celular.
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

export function tocarSomCarta() {
  try {
    const ac = getCtx();
    if (!ac) return;
    const agora = ac.currentTime;
    const dur = 0.32;

    // Corpo grave que cai de leve — a "massa" da vibração
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(76, agora);
    osc.frequency.linearRampToValueAtTime(54, agora + dur);

    // Passa-baixa bem fechado: tira a aspereza, sobra só o ronco
    const filtro = ac.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(320, agora);
    filtro.Q.value = 0.7;

    // Tremolo em série (0..1) = textura de vibração.
    // Em série, e não somado ao ganho do envelope, pra não passar
    // por zero e estalar.
    const tremolo = ac.createGain();
    tremolo.gain.value = 0.5;
    const lfo = ac.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(33, agora);
    lfo.frequency.linearRampToValueAtTime(24, agora + dur);
    const lfoGanho = ac.createGain();
    lfoGanho.gain.value = 0.5;

    // Envelope: ataque macio (sem clique) e cauda curta
    const env = ac.createGain();
    env.gain.setValueAtTime(0.0001, agora);
    env.gain.exponentialRampToValueAtTime(0.5, agora + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, agora + dur);

    lfo.connect(lfoGanho).connect(tremolo.gain);
    osc.connect(filtro).connect(tremolo).connect(env).connect(ac.destination);

    osc.start(agora);
    lfo.start(agora);
    osc.stop(agora + dur);
    lfo.stop(agora + dur);

    // Vibração real no aparelho, quando o navegador deixa (Android).
    // Um toque curto, casado com o som.
    try {
      if (navigator.vibrate) navigator.vibrate(18);
    } catch (e) {}
  } catch (e) {
    // Áudio indisponível — segue sem som.
  }
}
