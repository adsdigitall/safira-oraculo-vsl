import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { tocarSomCarta, prepararAudio } from '../lib/somCartas';
import CartaVerso from './CartaVerso';
import { STORAGE } from '../config';

// ─────────────────────────────────────────────────────────────
//  QUIZ ORÁCULO MODELADO (Fiel ao xquiz.io)
//  1. Intro (Página 1)
//  2. Perguntas 1 a 5 (Páginas 2 a 6)
//  3. Transição / Diagnóstico (Página 7)
//  4. Mesa de 8 Cartas com Flip 3D (Página 8)
//  5. VSL 1 — Leitura das Cartas + Carta Sagrada (Página 9)
//  6. VSL 2 — Oferta & Ativação do Código (Página 10)
// ─────────────────────────────────────────────────────────────

// Efeito de partículas de brilho (Sparkles)
function dispararSparkles(cx, cy) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'cs-sparkle';
    const angle = (i / count) * Math.PI * 2;
    const dist = 30 + Math.random() * 65;
    const size = 3 + Math.random() * 5 + 'px';
    el.style.cssText = [
      'left:' + cx + 'px',
      'top:' + cy + 'px',
      'width:' + size,
      'height:' + size,
      'background:' + (Math.random() > 0.4 ? '#F0D080' : '#9B59D0'),
      '--tx:' + Math.cos(angle) * dist + 'px',
      '--ty:' + Math.sin(angle) * dist + 'px',
      '--dur:' + (0.5 + Math.random() * 0.6) + 's',
      '--delay:' + Math.random() * 0.12 + 's',
    ].join(';');
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// Aurora de fundo místico
function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="quiz-aurora">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(88,28,135,0.45)_0%,_rgba(15,8,30,0.85)_60%,_rgba(10,5,20,1)_100%)]" />
    </div>
  );
}

function adicionarAutoplay(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (url.includes('autoplay=')) return url;
  const separador = url.includes('?') ? '&' : '?';
  return `${url}${separador}autoplay=1&playsinline=1&enablejsapi=1`;
}

// Componente Universal para Vídeos (Vturb, Tynk, YouTube, iframe, mp4) com Autoplay Automático
function VideoEmbedPlayer({ url, aspect = '4:5', onIniciado, id = 'player' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const cleanAspect = String(aspect || '4:5').replace('/', ':');
  const aspectClass =
    cleanAspect === '9:16'
      ? 'aspect-[9/16] w-full max-w-[320px] sm:max-w-[360px] mx-auto'
      : cleanAspect === '16:9'
      ? 'aspect-video w-full max-w-full'
      : 'aspect-[4/5] w-full max-w-[340px] sm:max-w-[400px] mx-auto';

  // Inicia timer automaticamente ao carregar
  useEffect(() => {
    if (onIniciado) onIniciado();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [onIniciado]);

  const handleStart = () => {
    setIsPlaying(true);
    if (onIniciado) onIniciado();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (!url || String(url).trim() === '' || String(url).includes('SEU-LINK')) {
    return (
      <div className={`relative flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-[#1e0f45]/90 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40">
          <Play className="ml-1 h-8 w-8 fill-current" />
        </div>
        <p className="text-sm font-semibold text-amber-200">Vídeo em Configuração</p>
        <p className="mt-1 text-xs text-purple-200/70">O link do vídeo pode ser inserido no painel ou config.js</p>
      </div>
    );
  }

  const cleanUrl = url.trim();

  // Se for código iframe puro
  if (cleanUrl.includes('<iframe') || cleanUrl.includes('<vturb-smartplayer') || cleanUrl.includes('<script')) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <div
          className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 [&_vturb-smartplayer]:w-full"
          dangerouslySetInnerHTML={{ __html: cleanUrl }}
        />
      </div>
    );
  }

  // Se for YouTube
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const ytId = ytMatch[1];
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Vídeo"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Se for MP4 direto
  if (cleanUrl.endsWith('.mp4') || cleanUrl.includes('.mp4?')) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <video
          ref={videoRef}
          src={cleanUrl}
          playsInline
          autoPlay
          controls
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Tynk / VTurb / Iframe padrão com autoplay
  const autoplayUrl = adicionarAutoplay(cleanUrl);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
      <iframe
        src={autoplayUrl}
        title="Vídeo da Leitura"
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default function QuizOraculo({ config, variationId = 'v1', onConcluir }) {
  const quizStorageKey = `${STORAGE.quizEstado}_${variationId}`;

  // O quiz SEMPRE inicia na Página 1 (intro) a cada atualização de página (F5/Reload).
  const [etapa, setEtapa] = useState('intro');
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [cartasEscolhidas, setCartasEscolhidas] = useState([]);
  const [transicaoFase, setTransicaoFase] = useState(0);

  // Limpa qualquer resquício de estado salvo anterior
  useEffect(() => {
    try {
      localStorage.removeItem(quizStorageKey);
    } catch (e) {}
  }, [quizStorageKey]);

  // VSL 1 states
  const [vsl1Iniciada, setVsl1Iniciada] = useState(false);
  const [segundosVsl1, setSegundosVsl1] = useState(0);
  const [cartaSagradaEscolhida, setCartaSagradaEscolhida] = useState(null);

  // VSL 2 states
  const [vsl2Iniciada, setVsl2Iniciada] = useState(false);
  const [segundosVsl2, setSegundosVsl2] = useState(0);

  // Áudio swoosh element ref
  const audioSwooshRef = useRef(null);

  const perguntas = useMemo(() => {
    if (Array.isArray(config.quizPerguntas) && config.quizPerguntas.length > 0) {
      return config.quizPerguntas;
    }
    return [];
  }, [config.quizPerguntas]);

  const cartas = useMemo(() => {
    return (config.quizCartas || []).slice(0, 8);
  }, [config.quizCartas]);

  const reveladas = useMemo(() => {
    return config.quizCartasReveladas || [];
  }, [config.quizCartasReveladas]);

  const cartasSagradas = useMemo(() => {
    return config.quizVsl1CartasSagradas || [];
  }, [config.quizVsl1CartasSagradas]);

  // Cronômetros de VSLs
  useEffect(() => {
    if (!vsl1Iniciada || etapa !== 'vsl1') return undefined;
    const interval = window.setInterval(() => setSegundosVsl1((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [vsl1Iniciada, etapa]);

  useEffect(() => {
    if (!vsl2Iniciada || etapa !== 'vsl2') return undefined;
    const interval = window.setInterval(() => setSegundosVsl2((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [vsl2Iniciada, etapa]);

  // Transição (Página 7) animação em cascata
  useEffect(() => {
    if (etapa !== 'transicao') return undefined;
    setTransicaoFase(0);
    const t1 = setTimeout(() => setTransicaoFase(1), 1200);
    const t2 = setTimeout(() => setTransicaoFase(2), 2600);
    const t3 = setTimeout(() => setTransicaoFase(3), 4000);
    const t4 = setTimeout(() => setTransicaoFase(4), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [etapa]);

  // Tocar som seguro
  const executarSomSwoosh = () => {
    try {
      if (audioSwooshRef.current) {
        audioSwooshRef.current.currentTime = 0;
        audioSwooshRef.current.volume = 1;
        const p = audioSwooshRef.current.play();
        if (p && p.then) p.catch(() => tocarSomCarta());
      } else {
        tocarSomCarta();
      }
    } catch {
      tocarSomCarta();
    }
  };

  // 1. Iniciar quiz
  const handleIniciarQuiz = () => {
    prepararAudio();
    setEtapa('perguntas');
    setPerguntaIndex(0);
  };

  // 2. Responder pergunta
  const handleResponder = (opcaoIdx) => {
    prepararAudio();
    tocarSomCarta();
    const novas = [...respostas];
    novas[perguntaIndex] = opcaoIdx;
    setRespostas(novas);

    if (perguntaIndex < perguntas.length - 1) {
      setTimeout(() => {
        setPerguntaIndex((i) => i + 1);
      }, 250);
    } else {
      setTimeout(() => {
        setEtapa('transicao');
      }, 300);
    }
  };

  // 3. Escolher carta na mesa de 8 cartas
  const handleEscolherCarta = (cardIdx, event) => {
    if (cartasEscolhidas.includes(cardIdx) || cartasEscolhidas.length >= 3) return;

    prepararAudio();
    executarSomSwoosh();

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    const novoPicks = [...cartasEscolhidas, cardIdx];
    setCartasEscolhidas(novoPicks);

    if (novoPicks.length === 3) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#c084fc', '#ffffff'],
        });
      }, 600);
    }
  };

  // 4. Escolher carta sagrada na VSL 1
  const handleEscolherCartaSagrada = (idx, event) => {
    if (cartaSagradaEscolhida === idx) return;
    prepararAudio();
    executarSomSwoosh();

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setCartaSagradaEscolhida(idx);
  };

  // 5. Ir para Checkout (Dispara InitiateCheckout no Pixel)
  const handleAbrirCheckout = () => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: 'Safira Oráculo - Ativação do Código',
          currency: 'BRL',
          value: 40.00,
        });
      }
    } catch (e) {}

    const destino = (config.quizVsl2CtaUrl || config.checkoutUrl || '').trim();
    if (destino) {
      window.location.href = destino;
    }
  };

  // Cálculo da porcentagem da barra de progresso
  const progressoPct = useMemo(() => {
    if (etapa === 'intro') return 0;
    if (etapa === 'perguntas') {
      const step = (perguntaIndex + 1) / (perguntas.length + 2);
      return Math.round(step * 70);
    }
    if (etapa === 'transicao') return 75;
    if (etapa === 'cartas') return 80;
    if (etapa === 'vsl1') return 90;
    if (etapa === 'vsl2') return 100;
    return 100;
  }, [etapa, perguntaIndex, perguntas.length]);

  const perguntaAtual = perguntas[perguntaIndex];

  // Delays de VSL
  const vsl1DelaySegundos = Number(config.quizVsl1Delay ?? 0);
  const mostrarCtaVsl1 = vsl1DelaySegundos === 0 || (vsl1Iniciada && segundosVsl1 >= vsl1DelaySegundos);

  const vsl2DelaySegundos = Number(config.quizVsl2Delay ?? 0);
  const mostrarCtaVsl2 = vsl2DelaySegundos === 0 || (vsl2Iniciada && segundosVsl2 >= vsl2DelaySegundos);

  const isVsl = etapa === 'vsl1' || etapa === 'vsl2';

  return (
    <div className={`relative w-full bg-[#3008a1] text-white font-sans flex flex-col items-center select-none ${isVsl ? 'h-[100dvh] max-h-[100dvh] overflow-hidden justify-between p-3 sm:py-4' : 'min-h-[100dvh] overflow-x-hidden justify-start px-4 py-6 sm:py-8'}`}>
      <AuroraBackground />

      {/* Áudio pré-carregado de virada de carta */}
      <audio
        ref={audioSwooshRef}
        preload="auto"
        src={config.quizAudioUrl || 'https://media.base44.com/files/public/user_6a345b7a1d1c8dfb9baf54b0/421f6cbfb_universfield-swoosh-06-351021.mp3'}
      />

      <main className={`relative z-10 my-auto flex w-full flex-col ${isVsl ? 'max-w-md h-full max-h-full justify-between gap-1.5 sm:gap-3' : 'max-w-lg flex-auto gap-6 sm:gap-8'}`}>

        {/* ── CABEÇALHO COM LOGO E PROGRESSO ── */}
        <header className="flex flex-col items-center text-center shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold tracking-widest text-xs uppercase mb-2">
            <span className="text-amber-400 text-sm">✨</span>
            <span>🔮 {config.productName || 'SAFIRA ORÁCULO'} 🔮</span>
            <span className="text-amber-400 text-sm">✨</span>
          </div>

          {/* Barra de Progresso Dourada */}
          {etapa !== 'intro' && (
            <div className="w-full max-w-md mt-1 mb-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-950/90 p-0.5 ring-1 ring-amber-400/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                  style={{ width: `${progressoPct}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 1 — INTRODUÇÃO DO QUIZ
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'intro' && (
          <section className="flex flex-col items-center text-center animate-fadeIn space-y-6">
            {/* Badge de Topo */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-400/50 text-[11px] font-extrabold text-amber-300 tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>✨ CONSULTA SAGRADA DE TARÔ 2026 ✨</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md">
              🔮 {config.quizIntroTitulo || 'Descubra Agora o Que as Cartas Revelam Sobre a Sua Vida Neste Ano De 2026!'} ✨
            </h1>

            {/* Imagem Mística Principal */}
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-amber-400/60 shadow-[0_0_40px_rgba(201,168,76,0.45)] bg-purple-950/40">
              <img
                src={config.quizHeroUrl || 'https://cdn.xquiz.co/images/7302e5ee-a1ba-40b5-b6eb-a7827f03198f'}
                alt="Oráculo e Cartas"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = '/luna.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b084a]/80 via-transparent to-transparent" />
            </div>

            {/* Botão de Início */}
            <button
              type="button"
              onClick={handleIniciarQuiz}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-lg sm:text-xl uppercase tracking-wider shadow-[0_8px_30px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/50 animate-pulse flex items-center justify-center gap-2"
            >
              <span>🔮 {config.quizIntroCta || 'FAZER LEITURA GRATUITA'}</span>
              <span className="text-xl">➔</span>
            </button>

            <p className="text-sm sm:text-base text-purple-200/90 font-medium leading-relaxed max-w-md mx-auto">
              {config.quizIntroSubtitulo || 'As cartas podem revelar o caminho exato para destravar os caminhos travados em sua vida.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-amber-300/90 pt-1">
              <span className="flex items-center gap-1">🔒 100% Gratuito & Particular</span>
              <span>•</span>
              <span className="flex items-center gap-1">⚡ Resposta Imediata</span>
              <span>•</span>
              <span className="flex items-center gap-1">🌟 Guias Astrais</span>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINAS 2 a 6 — PERGUNTAS INTERATIVAS
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'perguntas' && perguntaAtual && (
          <section className="flex flex-col items-center animate-fadeIn w-full space-y-6">
            <div className="w-full text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-amber-400/40 text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1 shadow-sm">
                <span>📜 PERGUNTA {perguntaIndex + 1} DE {perguntas.length} ✦</span>
              </div>

              {perguntaAtual.kicker && (
                <p className="text-amber-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  ⚠️ {perguntaAtual.kicker}
                </p>
              )}

              {perguntaAtual.subtexto && (
                <p className="text-purple-200 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                  🔮 {perguntaAtual.subtexto}
                </p>
              )}

              <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white">
                {perguntaAtual.titulo}
              </h2>
            </div>

            {/* Lista de Opções */}
            <div className="w-full flex flex-col gap-3">
              {perguntaAtual.opcoes.map((opcao, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleResponder(idx)}
                  className="group relative flex w-full items-center justify-between rounded-xl border border-purple-400/30 bg-[#251059]/90 hover:bg-[#34187a] hover:border-amber-400/80 p-4 text-left shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                >
                  <span className="text-sm sm:text-base font-semibold text-purple-100 group-hover:text-white leading-snug pr-3">
                    {opcao.texto}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-900/60 text-amber-300 group-hover:bg-amber-400 group-hover:text-purple-950 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-purple-300/70 text-center flex items-center justify-center gap-1.5">
              <span>✨ Selecione a resposta que mais toca sua intuição 🔮</span>
            </p>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 7 — TRANSIÇÃO / DIAGNÓSTICO
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'transicao' && (
          <section className="flex flex-col items-center text-center animate-fadeIn w-full space-y-6">
            {/* Loading Orb */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-800 to-amber-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.6)] ring-2 ring-amber-300/50">
                <Sparkles className="h-8 w-8 text-amber-200 animate-spin" />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-amber-300">
              🔮 {config.quizTransicaoCarregando || 'Analisando suas respostas...'} ✨
            </h2>

            {/* Frases sequenciais em cascata com emojis */}
            <div className="w-full max-w-md space-y-4 text-purple-100 text-sm sm:text-base leading-relaxed">
              <p className={`transition-all duration-700 ${transicaoFase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 font-normal'}`}>
                <strong>🌌 1. A partir do que você me revelou...</strong>
                <br />
                O universo irá filtrar, entre milhares de combinações astrais possíveis...
              </p>

              <p className={`transition-all duration-700 ${transicaoFase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 font-normal'}`}>
                <strong>✨ 2. As únicas 8 cartas capazes de falar diretamente com a sua energia neste momento.</strong>
              </p>

              <p className={`transition-all duration-700 ${transicaoFase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 font-normal'}`}>
                🎴 3. Escolha apenas 3 para descobrir o caminho exato para destravar tudo em 2026.
              </p>

              <p className={`text-xl font-black text-amber-400 tracking-wide transition-all duration-700 ${transicaoFase >= 4 ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}`}>
                ⚡ Prepare-se. O portal sagrado está aberto! 🔮
              </p>
            </div>

            {/* Botão de Avançar */}
            {transicaoFase >= 4 && (
              <button
                type="button"
                onClick={() => setEtapa('cartas')}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-lg uppercase tracking-wider shadow-[0_8px_30px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/50 animate-pulse flex items-center justify-center gap-2"
              >
                <span>🎴 {config.quizTransicaoCta || 'Escolher Minhas Cartas Agora'}</span>
                <span className="text-xl">➔</span>
              </button>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 8 — ESCOLHA DAS 8 CARTAS (GRID 4x2 com 3D Flip)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'cartas' && (
          <section className="flex flex-col items-center text-center animate-fadeIn w-full space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              🎴 {config.quizCartasTitulo || 'O baralho está aberto para você:'} ✨
            </h2>

            <div className="text-sm sm:text-base text-purple-200 space-y-1">
              <p><strong>🔮 Não pense muito, apenas sinta sua intuição.</strong></p>
              <p>Escolha 3 cartas, uma de cada vez, <strong>na ordem que o seu instinto mandar:</strong></p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-purple-950/80 px-4 py-1.5 rounded-full border border-amber-400/50 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>✨ {cartasEscolhidas.length} de 3 cartas selecionadas 🔮</span>
            </div>

            {/* GRID DE 8 CARTAS (4 COLUNAS x 2 LINHAS) */}
            <div className="cs-grid my-2">
              {cartas.map((carta, index) => {
                const ordemEscolhida = cartasEscolhidas.indexOf(index);
                const isFlipped = ordemEscolhida !== -1;
                const isInactive = cartasEscolhidas.length >= 3 && !isFlipped;
                const revelada = isFlipped ? reveladas[ordemEscolhida] : null;

                return (
                  <div
                    key={carta.id || index}
                    onClick={(e) => handleEscolherCarta(index, e)}
                    className={`cs-card ${isFlipped ? 'cs-flipped cs-done' : ''} ${isInactive ? 'cs-inactive' : ''}`}
                  >
                    {/* Badge Circular no Topo */}
                    <div className="cs-badge">
                      {isFlipped ? ordemEscolhida + 1 : ''}
                    </div>

                    <div className="cs-card-inner">
                      {/* VERSO (DORSO) */}
                      <div className="cs-back">
                        {carta.verso ? (
                          <img
                            src={carta.verso}
                            alt={carta.alt || `Carta ${index + 1}`}
                            loading="eager"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <CartaVerso simbolo="✦" />
                        )}
                      </div>

                      {/* FRENTE (REVELADA) */}
                      <div className="cs-front">
                        {revelada && (
                          <img
                            src={revelada.src || revelada.frente}
                            alt={revelada.nome || revelada.alt}
                            className="cs-img"
                            loading="eager"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÃO PARA VER RESULTADO (LIBERADO APÓS AS 3 CARTAS) */}
            {cartasEscolhidas.length >= 3 && (
              <div className="w-full pt-3 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setEtapa('vsl1')}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-lg sm:text-xl uppercase tracking-wider shadow-[0_8px_30px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/60 animate-pulse flex items-center justify-center gap-2"
                >
                  <span>✨ {config.quizBotaoRevelacaoTexto || 'VER RESULTADO DA LEITURA'}</span>
                  <span className="text-xl">➔</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 9 — VSL 1 (Vídeo 1 + Escolha da Carta Sagrada)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'vsl1' && (
          <section className="flex flex-col items-center justify-between text-center animate-fadeIn w-full h-full max-h-full space-y-2 py-1">
            {/* Top Redline & Headline */}
            <div className="w-full space-y-1.5 shrink-0 px-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-[10px] font-black text-red-300 uppercase tracking-widest animate-pulse shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>🔴 AVISO URGENTE DOS GUIAS ⚠️</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                🔮 AS CARTAS REVELARAM UM BLOQUEIO: <span className="text-amber-300">ASSISTA ATÉ O FINAL PARA LIBERAR SEUS CAMINHOS ✨</span>
              </h2>

              {/* Aviso de Urgência — Vídeo vai sair do ar */}
              <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-[10px] sm:text-xs text-red-200 font-bold shadow-inner">
                <span>⚠️</span>
                <span><strong>Este vídeo vai sair do ar a qualquer momento</strong>, então <u>não feche este vídeo</u>!</span>
              </div>
            </div>

            {/* Player de Vídeo VSL 1 em 4:5 */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center">
              <VideoEmbedPlayer
                url={config.quizVsl1Url || config.vslUrl}
                aspect="4:5"
                onIniciado={() => setVsl1Iniciada(true)}
                id="vsl1-player"
              />
            </div>

            {/* SEÇÃO DA CARTA SAGRADA DO ALTAR (Aparece com delay ou imediato) */}
            {mostrarCtaVsl1 && (
              <div className="w-full space-y-1.5 pt-1 animate-fadeIn shrink-0">
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
                    <span>🎴 {config.quizVsl1Titulo || 'Escolha a sua carta no Altar Sagrado:'} ✨</span>
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    {config.quizVsl1Subtitulo || '(Toque na sua carta e depois em "Continuar" 👇)'}
                  </p>
                </div>

                {/* Fileira de Cartas Sagradas */}
                <div className="sacred-cards-wrap sc-visible py-0.5" id="scRow">
                  {cartasSagradas.map((card, idx) => {
                    const isSelected = cartaSagradaEscolhida === idx;
                    const isDimmed = cartaSagradaEscolhida !== null && !isSelected;

                    return (
                      <div
                        key={card.id || idx}
                        onClick={(e) => handleEscolherCartaSagrada(idx, e)}
                        className={`sc-card ${isSelected ? 'sc-flipped' : ''} ${isDimmed ? 'sc-inactive' : ''}`}
                      >
                        <div className="sc-card-inner">
                          {/* Verso Dourado em SVG */}
                          <div className="sc-back">
                            <svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="3" width="94" height="154" rx="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
                              <rect x="8" y="8" width="84" height="144" rx="3" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.35" />
                              <polygon points="50,18 55,48 82,48 60,65 68,95 50,78 32,95 40,65 18,48 45,48" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.65" />
                              <circle cx="50" cy="115" r="20" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />
                              <text x="11" y="20" fontSize="7" fill="#C9A84C" opacity="0.55" fontFamily="serif">✦</text>
                              <text x="84" y="20" fontSize="7" fill="#C9A84C" opacity="0.55" fontFamily="serif">✦</text>
                              <text x="11" y="150" fontSize="7" fill="#C9A84C" opacity="0.55" fontFamily="serif">✦</text>
                              <text x="84" y="150" fontSize="7" fill="#C9A84C" opacity="0.55" fontFamily="serif">✦</text>
                            </svg>
                          </div>
                          {/* Frente da Carta Sagrada */}
                          <div className="sc-front">
                            <img src={card.frente} alt={card.nome} loading="eager" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botão de Continuar para VSL 2 */}
                <button
                  type="button"
                  onClick={() => setEtapa('vsl2')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-sm uppercase tracking-wider shadow-[0_6px_20px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/50 animate-pulse flex items-center justify-center gap-2"
                >
                  <span>👉 {config.quizVsl1CtaTexto || 'CONTINUAR PARA ATIVAÇÃO'}</span>
                  <span className="text-base">➔</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 10 — VSL 2 (Vídeo 2 + Ativação / Oferta de Checkout)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'vsl2' && (
          <section className="flex flex-col items-center justify-between text-center animate-fadeIn w-full h-full max-h-full space-y-2 py-1">
            {/* Top Redline & Headline */}
            <div className="w-full space-y-1.5 shrink-0 px-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-600/30 border border-emerald-500/50 text-[10px] font-black text-emerald-300 uppercase tracking-widest animate-pulse shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>⚡ ÚLTIMA ETAPA • ATIVAÇÃO DO CÓDIGO 🔥</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                🔥 ATIVAÇÃO DOS SEUS CAMINHOS: <span className="text-amber-300">DESTRAVE SUA VIDA FINANCEIRA E AMOROSA EM 2026 ✨</span>
              </h2>

              {/* Aviso de Urgência — Vídeo vai sair do ar */}
              <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-[10px] sm:text-xs text-amber-200 font-bold shadow-inner">
                <span>⚠️</span>
                <span><strong>Este vídeo vai sair do ar a qualquer momento</strong>, então <u>não feche este vídeo</u>!</span>
              </div>
            </div>

            {/* Player de Vídeo VSL 2 em 4:5 */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center">
              <VideoEmbedPlayer
                url={config.quizVsl2Url || config.vslUrl}
                aspect="4:5"
                onIniciado={() => setVsl2Iniciada(true)}
                id="vsl2-player"
              />
            </div>

            {/* Botão CTA Principal de Conversão */}
            {mostrarCtaVsl2 && (
              <div className="w-full space-y-1.5 pt-1 animate-fadeIn shrink-0">
                <button
                  type="button"
                  onClick={handleAbrirCheckout}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#00c853] via-[#00e676] to-[#00b0ff] text-[#051a0e] font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_8px_30px_rgba(0,230,118,0.6)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-4 ring-white/60 animate-pulse flex items-center justify-center gap-2"
                >
                  <span>👉 {config.quizVsl2CtaTexto || 'SIM! QUERO ATIVAR O MEU CÓDIGO AGORA'}</span>
                  <span className="text-lg">➔</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-purple-200/90 pt-0.5">
                  <span>🔒 Acesso Imediato & 100% Seguro</span>
                  <span>•</span>
                  <span>⚡ Vagas Limitadas no Altar</span>
                  <span>•</span>
                  <span>🌟 Garantia Incondicional</span>
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
