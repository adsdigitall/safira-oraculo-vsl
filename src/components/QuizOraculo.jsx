import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { tocarSomCarta, prepararAudio } from '../lib/somCartas';
import CartaVerso from './CartaVerso';
import SocialProofToast from './SocialProofToast';
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
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [cartasEscolhidas, setCartasEscolhidas] = useState([]);
  const [transicaoFase, setTransicaoFase] = useState(0);

  // VSL states e cronômetro de alta precisão imune a throttling de aba
  const [vslIniciada, setVslIniciada] = useState(false);
  const [segundosVsl, setSegundosVsl] = useState(0);
  const vslTimestampInicioRef = useRef(null);

  // Áudio swoosh element ref
  const audioSwooshRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.removeItem(quizStorageKey);
    } catch (e) {}
  }, [quizStorageKey]);

  const perguntas = useMemo(() => {
    return Array.isArray(config.quizPerguntas) ? config.quizPerguntas : [];
  }, [config.quizPerguntas]);

  const cartas = useMemo(() => {
    return (config.quizCartas || []).slice(0, 8);
  }, [config.quizCartas]);

  const reveladas = useMemo(() => {
    return config.quizCartasReveladas || [];
  }, [config.quizCartasReveladas]);

  const isVsl = etapa === 'vsl';

  // Cronômetro da VSL à prova de falhas (usa timestamp real para nunca atrasar em segundo plano)
  useEffect(() => {
    if (!isVsl) return undefined;
    setVslIniciada(true);
    if (!vslTimestampInicioRef.current) {
      vslTimestampInicioRef.current = Date.now();
    }

    const interval = window.setInterval(() => {
      if (vslTimestampInicioRef.current) {
        const decorrido = Math.floor((Date.now() - vslTimestampInicioRef.current) / 1000);
        setSegundosVsl(decorrido);
      } else {
        setSegundosVsl((s) => s + 1);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [isVsl]);

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

  const handleIniciarQuiz = () => {
    prepararAudio();
    setEtapa('perguntas');
    setPerguntaIndex(0);
  };

  const handleResponder = (opcaoIdx, event) => {
    if (opcaoSelecionada !== null) return;
    prepararAudio();
    executarSomSwoosh();
    setOpcaoSelecionada(opcaoIdx);

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setRespostas((prev) => [...prev, opcaoIdx]);

    setTimeout(() => {
      setOpcaoSelecionada(null);
      if (perguntaIndex + 1 < perguntas.length) {
        setPerguntaIndex((i) => i + 1);
      } else {
        setEtapa('transicao');
      }
    }, 240);
  };

  const handleEscolherCarta = (index, event) => {
    if (cartasEscolhidas.includes(index) || cartasEscolhidas.length >= 3) return;
    prepararAudio();
    executarSomSwoosh();

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setCartasEscolhidas((prev) => [...prev, index]);
  };

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

    const destinoBase = (config.quizVsl2CtaUrl || config.vslCtaUrl || config.checkoutUrl || 'https://lastlink.com/p/C03402B87/checkout-payment/').trim();
    if (destinoBase) {
      try {
        const urlParams = window.location.search;
        if (urlParams) {
          const searchParams = new URLSearchParams(urlParams);
          searchParams.delete('delay');
          searchParams.delete('cta');
          searchParams.delete('teste');
          searchParams.delete('debug');

          const finalParams = searchParams.toString();
          if (finalParams) {
            const separator = destinoBase.includes('?') ? '&' : '?';
            window.location.href = `${destinoBase}${separator}${finalParams}`;
            return;
          }
        }
      } catch (err) {}

      window.location.href = destinoBase;
    }
  };

  const progressoPct = useMemo(() => {
    if (etapa === 'intro') return 0;
    if (etapa === 'perguntas') {
      const step = (perguntaIndex + 1) / (perguntas.length + 2);
      return Math.round(step * 70);
    }
    if (etapa === 'transicao') return 75;
    if (etapa === 'cartas') return 80;
    if (isVsl) return 100;
    return 100;
  }, [etapa, perguntaIndex, perguntas.length, isVsl]);

  const perguntaAtual = perguntas[perguntaIndex];

  // Permite testar o botão instantaneamente adicionando ?delay=0 ou ?cta=0 na URL
  const isDebugCta = typeof window !== 'undefined' && (
    window.location.search.includes('delay=0') ||
    window.location.search.includes('cta=0') ||
    window.location.search.includes('teste=1') ||
    window.location.search.includes('debug=1')
  );

  // 17 minutos e 30 segundos = 1050 segundos exatos
  const vslDelaySegundos = isDebugCta ? 0 : Number(config.quizVsl2Delay ?? config.vslCtaSegundo ?? 1050);
  const mostrarCtaVsl = vslDelaySegundos === 0 || segundosVsl >= vslDelaySegundos;

  return (
    <div className={`relative w-full bg-[#3008a1] text-white font-sans flex flex-col items-center select-none ${isVsl ? 'h-[100dvh] max-h-[100dvh] overflow-hidden justify-between p-3 sm:py-4' : 'min-h-[100dvh] overflow-x-hidden justify-start px-4 py-6 sm:py-8'}`}>
      <AuroraBackground />

      <audio
        ref={audioSwooshRef}
        preload="auto"
        src={config.quizAudioUrl || 'https://media.base44.com/files/public/user_6a345b7a1d1c8dfb9baf54b0/421f6cbfb_universfield-swoosh-06-351021.mp3'}
      />

      <main className={`relative z-10 my-auto flex w-full flex-col ${isVsl ? 'max-w-md h-full max-h-full justify-between gap-1.5 sm:gap-3' : 'max-w-lg flex-auto gap-6 sm:gap-8'}`}>

        <header className="flex flex-col items-center text-center shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold tracking-widest text-xs uppercase mb-2">
            <span className="text-amber-400 text-sm">✨</span>
            <span>🔮 {config.productName || 'SAFIRA ORÁCULO'} 🔮</span>
            <span className="text-amber-400 text-sm">✨</span>
          </div>

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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-400/50 text-[11px] font-extrabold text-amber-300 tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>✨ CONSULTA SAGRADA DE TARÔ 2026 ✨</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md">
              🔮 {config.quizIntroTitulo || 'Descubra Agora o Que as Cartas Revelam Sobre a Sua Vida Neste Ano De 2026!'} ✨
            </h1>

            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-amber-400/60 shadow-[0_0_40px_rgba(201,168,76,0.45)] bg-purple-950/40">
              <img
                src={config.quizHeroUrl || 'https://cdn.xquiz.co/images/7302e5ee-a1ba-40b5-b6eb-a7827f03198f'}
                alt="Oráculo e Cartas"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = '/luna.jpg';
                }}
              />
            </div>

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

            {/* Lista de Opções com Efeitos Premium e Feedback Tátil */}
            <div className="w-full flex flex-col gap-3.5">
              {perguntaAtual.opcoes.map((opcao, idx) => {
                const isSelected = opcaoSelecionada === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleResponder(idx, e)}
                    className={`group relative flex w-full items-center justify-between rounded-2xl border p-4 sm:p-4.5 text-left transition-all duration-200 overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-amber-300 bg-gradient-to-r from-[#4d1d8c] via-[#6524a8] to-[#4d1d8c] ring-2 ring-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.65)] scale-[1.02]'
                        : 'border-purple-400/30 bg-gradient-to-r from-[#220c4e]/95 via-[#2f1166]/95 to-[#220c4e]/95 hover:border-amber-400/80 hover:bg-[#361578] hover:shadow-[0_8px_25px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.35)]'
                    }`}
                  >
                    {/* Efeito Shimmer de Brilho Dinâmico ao passar o mouse ou tocar */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                    <span className={`text-sm sm:text-base font-semibold leading-snug pr-3 transition-colors ${
                      isSelected ? 'text-amber-200 font-extrabold' : 'text-purple-100 group-hover:text-white'
                    }`}>
                      {opcao.texto}
                    </span>

                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-400 text-purple-950 border-amber-300 scale-110 shadow-lg rotate-12'
                        : 'bg-purple-900/70 border-purple-400/30 text-amber-300 group-hover:bg-amber-400 group-hover:text-purple-950 group-hover:border-amber-300 group-hover:scale-105 shadow-sm'
                    }`}>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                );
              })}
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

            {/* Frases sequenciais em cascata com animação suave */}
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
                              const versosLocais = [
                                '/cartas/verso-1-lua.webp',
                                '/cartas/verso-2-estrela.webp',
                                '/cartas/verso-3-sol.webp',
                                '/cartas/verso-4-mandala.webp',
                                '/cartas/verso-5-frutos.webp',
                                '/cartas/verso-6-lotus.webp',
                                '/cartas/verso-7-rosas.webp',
                                '/cartas/verso-8-calice.webp',
                              ];
                              if (versosLocais[index]) {
                                e.currentTarget.src = versosLocais[index];
                              }
                            }}
                          />
                        ) : (
                          <CartaVerso simbolo="✦" />
                        )}
                      </div>

                      {/* FRENTE (REVELADA ORIGINAL) */}
                      <div className="cs-front">
                        {revelada && (
                          <img
                            src={revelada.src || revelada.frente}
                            alt={revelada.nome || revelada.alt}
                            className="cs-img"
                            loading="eager"
                            onError={(e) => {
                              if (ordemEscolhida === 0) e.currentTarget.src = '/cartas/frente-1-flecha.webp';
                              else if (ordemEscolhida === 1) e.currentTarget.src = '/cartas/frente-2-traicao.webp';
                              else if (ordemEscolhida === 2) e.currentTarget.src = '/cartas/frente-3-torre.webp';
                            }}
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
                  onClick={() => setEtapa('vsl')}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-lg sm:text-xl uppercase tracking-wider shadow-[0_8px_30px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/60 animate-pulse flex items-center justify-center gap-2"
                >
                  <span>✨ {config.quizBotaoRevelacaoTexto || 'VER RESULTADO DA LEITURA'}</span>
                  <span className="text-xl">➔</span>
                </button>
              </div>
            )}
          </section>
        )}

        {isVsl && (
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

              {/* Aviso de Urgência — Vídeo vai sair do ar (Maior e com mais destaque) */}
              <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-950/90 via-red-900/90 to-red-950/90 border border-red-500/60 text-xs sm:text-sm text-red-100 font-bold shadow-[0_0_15px_rgba(239,68,68,0.35)] leading-snug">
                <span className="text-sm sm:text-base">⚠️</span>
                <span><strong>Este vídeo vai sair do ar a qualquer momento</strong>, então <u className="decoration-amber-400 font-black text-amber-200">não feche este vídeo</u>!</span>
              </div>
            </div>

            {/* Player de Vídeo VSL em 4:5 com Autoplay */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center">
              <VideoEmbedPlayer
                url={config.quizVsl2Url || config.quizVsl1Url || config.vslUrl}
                aspect="4:5"
                onIniciado={() => setVslIniciada(true)}
                id="vsl-player"
              />
            </div>

            {/* Botão CTA Principal de Conversão (Aparece exatamente aos 17:30 / 1050s) */}
            {mostrarCtaVsl && (
              <div className="w-full space-y-2 pt-1 animate-fadeIn shrink-0">
                <button
                  type="button"
                  onClick={handleAbrirCheckout}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#e9ba2f] via-[#f5c85a] to-[#d99814] text-[#1a0836] font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_8px_30px_rgba(233,186,47,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-2 ring-white/60 animate-pulse flex items-center justify-center gap-2"
                >
                  <span>👉 {config.quizVsl2CtaTexto || config.vslCtaTexto || 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA'}</span>
                  <span className="text-xl">➔</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-purple-200/90 pt-0.5">
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

      {/* Notificações de Prova Social e Escassez (Ativam apenas quando o botão do checkout aparece) */}
      <SocialProofToast ativo={mostrarCtaVsl} />
    </div>
  );
}
