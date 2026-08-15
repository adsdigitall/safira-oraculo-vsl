import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Sparkles, ChevronRight, CheckCircle2, Flame, Star } from 'lucide-react';
import { tocarSomCarta, prepararAudio } from '../lib/somCartas';
import SocialProofToast from './SocialProofToast';
import { STORAGE } from '../config';
import {
  MESES_DO_ANO,
  FREQUENCIAS_SAGRADAS,
  calcularVibracaoNome,
  calcularAnoPessoal,
  obterDetalhesMapa,
  ARQUETIPOS_NUMEROLOGICOS
} from '../lib/numerologia';

// ─────────────────────────────────────────────────────────────
//  QUIZ NUMEROLÓGICO DE ALTA CONVERSÃO — MISTÉRIOS DA ALMA
//  1. Intro (Página 1) — Ativação & Promessa Hipnótica
//  2. Pergunta 1 — Polaridade Vibracional (Energia Feminina / Masculina / Universal)
//  3. Pergunta 2 — Mês de Nascimento (Ano Pessoal 2026 & Matriz Cósmica)
//  4. Pergunta 3 — Onde a vida mais está travada (Bloqueio Atual)
//  5. Pergunta 4 — Padrões Repetitivos & Sensação de Estagnação
//  6. Pergunta 5 — Entrada do Nome & Cálculo Pitagórico em Tempo Real
//  7. Mesa Mística — Escolha das 3 Frequências Sagradas da Alma (Cartas 3D)
//  8. Câmara de Decodificação — Cruzamento de Dados & Análise Hipnótica
//  9. Revelação / VSL — Vídeo Personalizado + Arquétipo + CTA de Alta Conversão
// ─────────────────────────────────────────────────────────────

// Efeito de partículas de brilho (Sparkles)
function dispararSparkles(cx, cy) {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'cs-sparkle';
    const angle = (i / count) * Math.PI * 2;
    const dist = 35 + Math.random() * 70;
    const size = 3 + Math.random() * 6 + 'px';
    el.style.cssText = [
      'left:' + cx + 'px',
      'top:' + cy + 'px',
      'width:' + size,
      'height:' + size,
      'background:' + (Math.random() > 0.35 ? '#fbbf24' : '#c084fc'),
      '--tx:' + Math.cos(angle) * dist + 'px',
      '--ty:' + Math.sin(angle) * dist + 'px',
      '--dur:' + (0.5 + Math.random() * 0.6) + 's',
      '--delay:' + Math.random() * 0.1 + 's',
    ].join(';');
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// Aurora de fundo místico cósmico
function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="quiz-aurora">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.45)_0%,_rgba(18,8,38,0.85)_55%,_rgba(8,3,18,1)_100%)]" />
      
      {/* Símbolos e partículas de fundo sutis */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[8%] left-[10%] text-2xl animate-pulse text-amber-300">✦</div>
        <div className="absolute top-[20%] right-[12%] text-3xl animate-pulse text-purple-300 delay-300">✧</div>
        <div className="absolute bottom-[25%] left-[8%] text-xl animate-pulse text-amber-200 delay-700">★</div>
        <div className="absolute bottom-[15%] right-[15%] text-2xl animate-pulse text-violet-300 delay-500">✦</div>
      </div>
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
function VideoEmbedPlayer({ url, aspect = '4:5', onIniciado }) {
  const videoRef = useRef(null);

  const cleanAspect = String(aspect || '4:5').replace('/', ':');
  const aspectClass =
    cleanAspect === '9:16'
      ? 'aspect-[9/16] w-full max-w-[320px] sm:max-w-[360px] mx-auto'
      : cleanAspect === '16:9'
      ? 'aspect-video w-full max-w-full'
      : 'aspect-[4/5] w-full max-w-[340px] sm:max-w-[400px] mx-auto';

  useEffect(() => {
    if (onIniciado) onIniciado();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [onIniciado]);

  if (!url || String(url).trim() === '' || String(url).includes('SEU-LINK')) {
    return (
      <div className={`relative flex flex-col items-center justify-center rounded-2xl border border-amber-500/40 bg-[#1e0f45]/90 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40">
          <Play className="ml-1 h-8 w-8 fill-current" />
        </div>
        <p className="text-sm font-semibold text-amber-200">Vídeo da Leitura Numerológica</p>
        <p className="mt-1 text-xs text-purple-200/70">O link do vídeo pode ser configurado no painel admin</p>
      </div>
    );
  }

  const cleanUrl = url.trim();

  // Se for código iframe puro
  if (cleanUrl.includes('<iframe') || cleanUrl.includes('<vturb-smartplayer') || cleanUrl.includes('<script')) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/35 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
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
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/35 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Vídeo da Leitura"
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
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/35 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
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
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/35 bg-black shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${aspectClass}`}>
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

export default function QuizNumerologico({ config, variationId = 'v1', onConcluir }) {
  const quizStorageKey = `${STORAGE.quizEstado}_num_${variationId}`;

  // Etapas: 'intro' -> 'energia' -> 'mes' -> 'bloqueio' -> 'padrao' -> 'nome' -> 'frequencias' -> 'analise' -> 'vsl'
  const [etapa, setEtapa] = useState('intro');
  
  // Respostas do usuário
  const [energiaSelecionada, setEnergiaSelecionada] = useState(null);
  const [mesNascimento, setMesNascimento] = useState(null);
  const [bloqueioSelecionado, setBloqueioSelecionado] = useState(null);
  const [padraoSelecionado, setPadraoSelecionado] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [frequenciasEscolhidas, setFrequenciasEscolhidas] = useState([]);
  
  // Estado da tela de decodificação/análise
  const [analiseProgresso, setAnaliseProgresso] = useState(0);
  const [analisePasso, setAnalisePasso] = useState(0);

  // VSL states e cronômetro de alta precisão
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

  const executarSom = () => {
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

  // Cálculo ao vivo do nome digitado
  const vibracaoAoVivo = useMemo(() => {
    if (!nomeUsuario.trim()) return null;
    return calcularVibracaoNome(nomeUsuario);
  }, [nomeUsuario]);

  // Detalhes consolidados do mapa
  const mapaCalculado = useMemo(() => {
    return obterDetalhesMapa({
      nome: nomeUsuario,
      mesId: mesNascimento,
      frequenciasEscolhidas,
    });
  }, [nomeUsuario, mesNascimento, frequenciasEscolhidas]);

  const isVsl = etapa === 'vsl';

  // Cronômetro da VSL à prova de falhas (timestamp real imune a throttling)
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

  // Animação da Câmara de Análise / Decodificação (0 a 100%)
  useEffect(() => {
    if (etapa !== 'analise') return undefined;
    setAnaliseProgresso(0);
    setAnalisePasso(0);

    const timerProgresso = setInterval(() => {
      setAnaliseProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(timerProgresso);
          return 100;
        }
        const incremento = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + incremento);
      });
    }, 180);

    const t1 = setTimeout(() => setAnalisePasso(1), 1200);
    const t2 = setTimeout(() => setAnalisePasso(2), 2600);
    const t3 = setTimeout(() => setAnalisePasso(3), 4200);
    const t4 = setTimeout(() => setAnalisePasso(4), 5600);
    const tFinal = setTimeout(() => {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
      setEtapa('vsl');
    }, 6800);

    return () => {
      clearInterval(timerProgresso);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tFinal);
    };
  }, [etapa]);

  const handleIniciar = () => {
    prepararAudio();
    executarSom();
    setEtapa('energia');
  };

  const handleSelecionarEnergia = (idx, event) => {
    prepararAudio();
    executarSom();
    setEnergiaSelecionada(idx);

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setTimeout(() => {
      setEtapa('mes');
    }, 280);
  };

  const handleSelecionarMes = (mesId, event) => {
    prepararAudio();
    executarSom();
    setMesNascimento(mesId);

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setTimeout(() => {
      setEtapa('bloqueio');
    }, 280);
  };

  const handleSelecionarBloqueio = (idx, event) => {
    prepararAudio();
    executarSom();
    setBloqueioSelecionado(idx);

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setTimeout(() => {
      setEtapa('padrao');
    }, 280);
  };

  const handleSelecionarPadrao = (idx, event) => {
    prepararAudio();
    executarSom();
    setPadraoSelecionado(idx);

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    setTimeout(() => {
      setEtapa('nome');
    }, 280);
  };

  const handleAvancarNome = (e) => {
    if (e) e.preventDefault();
    if (!nomeUsuario.trim()) return;
    prepararAudio();
    executarSom();
    setEtapa('frequencias');
  };

  const handleEscolherFrequencia = (freqId, event) => {
    if (frequenciasEscolhidas.includes(freqId) || frequenciasEscolhidas.length >= 3) return;
    prepararAudio();
    executarSom();

    const rect = event?.currentTarget?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    dispararSparkles(cx, cy);

    const novas = [...frequenciasEscolhidas, freqId];
    setFrequenciasEscolhidas(novas);

    if (novas.length === 3) {
      setTimeout(() => {
        setEtapa('analise');
      }, 700);
    }
  };

  const handleAbrirCheckout = () => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: 'Safira Oráculo - Ativação do Mapa Numerológico',
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

  // Cálculo da porcentagem da barra de progresso
  const progressoPct = useMemo(() => {
    switch (etapa) {
      case 'intro': return 0;
      case 'energia': return 15;
      case 'mes': return 30;
      case 'bloqueio': return 50;
      case 'padrao': return 65;
      case 'nome': return 80;
      case 'frequencias': return 90;
      case 'analise': return 95;
      case 'vsl': return 100;
      default: return 0;
    }
  }, [etapa]);

  // Permite testar o botão CTA instantaneamente com ?delay=0 ou ?cta=0 na URL
  const isDebugCta = typeof window !== 'undefined' && (
    window.location.search.includes('delay=0') ||
    window.location.search.includes('cta=0') ||
    window.location.search.includes('teste=1') ||
    window.location.search.includes('debug=1')
  );

  const vslDelaySegundos = isDebugCta ? 0 : Number(config.quizVsl2Delay ?? config.vslCtaSegundo ?? 1027);
  const mostrarCtaVsl = vslDelaySegundos === 0 || segundosVsl >= vslDelaySegundos;

  return (
    <div className={`relative w-full bg-[#12072b] text-white font-sans flex flex-col items-center select-none ${isVsl ? 'h-[100dvh] max-h-[100dvh] overflow-hidden justify-between p-3 sm:py-4' : 'min-h-[100dvh] overflow-x-hidden justify-start px-4 py-6 sm:py-8'}`}>
      <AuroraBackground />

      <audio
        ref={audioSwooshRef}
        preload="auto"
        src={config.quizAudioUrl || 'https://media.base44.com/files/public/user_6a345b7a1d1c8dfb9baf54b0/421f6cbfb_universfield-swoosh-06-351021.mp3'}
      />

      <main className={`relative z-10 my-auto flex w-full flex-col ${isVsl ? 'max-w-md h-full max-h-full justify-between gap-2 sm:gap-3' : 'max-w-lg flex-auto gap-6 sm:gap-8'}`}>

        {/* ─── HEADER MÍSTICO SUPERIOR ─────────────────────────── */}
        <header className="flex flex-col items-center text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-amber-500/30 text-amber-300 font-extrabold tracking-widest text-[11px] uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>🔮 {config.productName || 'SAFIRA ORÁCULO'} • MAPA NUMEROLÓGICO 🔮</span>
          </div>

          {etapa !== 'intro' && (
            <div className="w-full max-w-md mt-1 mb-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-purple-200/80 mb-1 px-1">
                <span>Consulta Numerológica 2026</span>
                <span className="text-amber-300 font-bold">{progressoPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-purple-950/90 p-0.5 ring-1 ring-amber-400/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  style={{ width: `${progressoPct}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 1 — INTRODUÇÃO DO QUIZ NUMEROLÓGICO
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'intro' && (
          <section className="flex flex-col items-center text-center animate-fadeIn space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-400/50 text-[11px] font-extrabold text-amber-300 tracking-wider shadow-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>TESTE NUMEROLÓGICO DA ALMA 2026</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-400 tracking-tight leading-tight drop-shadow-md">
                {config.quizIntroTitulo || 'Descubra Agora o Que o Seu Teste Numerológico Revela Sobre o Seu Destino em 2026!'}
              </h1>
              <p className="text-sm sm:text-base text-purple-100/90 font-medium leading-relaxed max-w-md mx-auto">
                {config.quizIntroSubtitulo || 'A vibração da sua data de nascimento e do seu nome revela a chave exata para destravar tudo o que está bloqueado na sua vida.'}
              </p>
            </div>

            {/* Mandala Mística de Geometria Sagrada */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/30 to-amber-400/20 blur-xl animate-pulse" />
              
              {/* Círculo com símbolos dos números */}
              <div className="relative w-full h-full rounded-full border-2 border-amber-400/40 flex items-center justify-center p-3 shadow-[0_0_35px_rgba(245,158,11,0.25)] bg-[#1b0c3d]/70 backdrop-blur-md">
                <div className="absolute inset-2 rounded-full border border-dashed border-purple-400/30 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-amber-500/20" />
                
                {/* Números sagrados orbitando */}
                <div className="absolute top-2 font-black text-amber-300 text-xs">3</div>
                <div className="absolute bottom-2 font-black text-amber-300 text-xs">7</div>
                <div className="absolute left-2 font-black text-amber-300 text-xs">8</div>
                <div className="absolute right-2 font-black text-amber-300 text-xs">11</div>
                <div className="absolute top-8 right-8 font-black text-purple-300 text-xs">22</div>
                <div className="absolute bottom-8 left-8 font-black text-purple-300 text-xs">33</div>

                {/* Símbolo do Oráculo Central */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.7)] text-slate-950 font-black text-2xl">
                    🔮
                  </div>
                  <span className="mt-2 text-[10px] font-black tracking-widest text-amber-300 uppercase">
                    Vibração Sagrada
                  </span>
                </div>
              </div>
            </div>

            {/* Badges de Confiança */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-200">
                <span className="text-amber-400 font-bold">⚡ 2 Minutos</span>
                <span className="text-[10px] text-purple-300/70">Leitura Rápida</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-200">
                <span className="text-amber-400 font-bold">🔒 100% Privado</span>
                <span className="text-[10px] text-purple-300/70">Confidencial</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-200">
                <span className="text-amber-400 font-bold">✨ Pitagórico</span>
                <span className="text-[10px] text-purple-300/70">Mapa Completo</span>
              </div>
            </div>

            {/* Botão Principal de Início */}
            <div className="w-full max-w-md pt-2">
              <button
                type="button"
                onClick={handleIniciar}
                className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.45)] active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-[14px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-purple-950 font-black text-base sm:text-lg tracking-wide uppercase">
                  <span>{config.quizIntroCta || 'INICIAR MEU TESTE NUMEROLÓGICO'}</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <p className="mt-2.5 text-center text-xs text-purple-300/80">
                ✨ Consulta gratuita por tempo limitado
              </p>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 2 — PERGUNTA 1: ENERGIA PREDOMINANTE (GÊNERO/POLARIDADE)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'energia' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 1 DE 6 • SINTONIZAÇÃO
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Qual é a sua energia predominante para a leitura?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80">
                Isso alinha a polaridade eletromagnética do seu mapa de nascimento.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3 pt-2">
              {[
                { id: 'feminina', titulo: '🌸 Energia Feminina', desc: 'Sensibilidade, intuição, atração e cura emocional profunda' },
                { id: 'masculina', titulo: '⚡ Energia Masculina', desc: 'Ação, foco, conquista material e direção de vida' },
                { id: 'universal', titulo: '🔮 Energia Universal / Neutra', desc: 'Equilíbrio holístico e alinhamento espiritual pleno' },
              ].map((opt, idx) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => handleSelecionarEnergia(idx, e)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                    energiaSelecionada === idx
                      ? 'bg-gradient-to-r from-amber-500/30 to-purple-800/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.01]'
                      : 'bg-[#1e0f45]/80 hover:bg-[#28155c] border-purple-600/30 hover:border-amber-400/50 active:scale-[0.99]'
                  }`}
                >
                  <div className="space-y-1 pr-3">
                    <div className="font-bold text-base text-amber-200 flex items-center gap-2">
                      {opt.titulo}
                    </div>
                    <div className="text-xs text-purple-200/70 leading-tight">
                      {opt.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 3 — PERGUNTA 2: MÊS DE NASCIMENTO (ANO PESSOAL 2026)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'mes' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 2 DE 6 • MATRIZ NATAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Em qual mês você nasceu?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80">
                O seu mês de nascimento define o seu <span className="text-amber-300 font-bold">Ano Pessoal de 2026</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-md pt-2 max-h-[60vh] overflow-y-auto pr-1">
              {MESES_DO_ANO.map((mes) => (
                <button
                  key={mes.id}
                  type="button"
                  onClick={(e) => handleSelecionarMes(mes.id, e)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 ${
                    mesNascimento === mes.id
                      ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-[#1b0c3d]/85 hover:bg-[#271357] border-purple-700/40 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold text-sm text-amber-300">{mes.nome}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 font-bold">Nº {mes.numero}</span>
                  </div>
                  <span className="text-[10px] text-purple-200/70 truncate w-full">{mes.signo}</span>
                  <span className="text-[9px] text-amber-400/90 font-medium mt-1 truncate w-full">✦ {mes.frequencia}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 4 — PERGUNTA 3: ONDE A VIDA ESTÁ MAIS TRAVADA (BLOQUEIO)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'bloqueio' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 3 DE 6 • DIAGNÓSTICO ENERGÉTICO
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Qual área da sua vida você mais sente necessidade de destravar hoje?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80">
                A numerologia sagrada identifica a raiz exata do bloqueio.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3 pt-2">
              {[
                { id: 'dinheiro', icone: '💰', titulo: 'Financeiro & Prosperidade', desc: 'Me esforço muito, mas sinto que o dinheiro não rende, estagna ou escorre pelas mãos' },
                { id: 'amor', icone: '💔', titulo: 'Amor & Relacionamento', desc: 'Padrões repetitivos de desilusão, mágoas do passado ou medo de me machucar de novo' },
                { id: 'proposito', icone: '🌿', titulo: 'Paz Interior & Propósito', desc: 'Ansiedade diária, sensação de vazio e dúvida constante sobre qual rumo tomar' },
                { id: 'sobrecarga', icone: '🌪️', titulo: 'Sobrecarga & Cansaço Extremo', desc: 'Dou tudo de mim pelos outros, mas quando preciso me sinto completamente sozinha' },
              ].map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelecionarBloqueio(idx, e)}
                  className={`w-full flex items-start justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                    bloqueioSelecionado === idx
                      ? 'bg-gradient-to-r from-amber-500/30 to-purple-800/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.01]'
                      : 'bg-[#1e0f45]/80 hover:bg-[#28155c] border-purple-600/30 hover:border-amber-400/50 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{item.icone}</span>
                    <div className="space-y-1">
                      <div className="font-bold text-sm sm:text-base text-amber-200">{item.titulo}</div>
                      <div className="text-xs text-purple-200/70 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 5 — PERGUNTA 4: PADRÃO REPETITIVO / TRAVA INVISÍVEL
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'padrao' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 4 DE 6 • PADRÕES KÁRMICOS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Você já teve a sensação de ver as coisas quase dando certo, mas no último momento algo invisível trava?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80">
                Identificando a frequência de repetição no seu campo áurico.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3 pt-2">
              {[
                { id: '1', texto: '✅ Sim, é exatamente o que acontece comigo com frequência' },
                { id: '2', texto: '⚠️ Sinto que existe uma barreira invisível me impedindo de crescer' },
                { id: '3', texto: '🔄 As coisas começam a andar bem e de repente voltam a estagnar' },
              ].map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelecionarPadrao(idx, e)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                    padraoSelecionado === idx
                      ? 'bg-gradient-to-r from-amber-500/30 to-purple-800/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.01]'
                      : 'bg-[#1e0f45]/80 hover:bg-[#28155c] border-purple-600/30 hover:border-amber-400/50 active:scale-[0.99]'
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-base text-purple-100 pr-2">
                    {item.texto}
                  </span>
                  <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 6 — PERGUNTA 5: ENTRADA DO NOME COM CÁLCULO PITAGÓRICO AO VIVO
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'nome' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 5 DE 6 • VIBRAÇÃO DO NOME
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Qual é o seu primeiro nome (ou nome completo)?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 max-w-sm mx-auto">
                A vibração sonora das letras do seu nome carrega o seu <span className="text-amber-300 font-bold">Código de Destino</span>.
              </p>
            </div>

            <form onSubmit={handleAvancarNome} className="w-full max-w-md space-y-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  placeholder="Digite seu nome aqui..."
                  autoFocus
                  className="w-full py-4 px-5 rounded-2xl bg-[#1b0c3d] border-2 border-amber-400/60 focus:border-amber-400 text-white placeholder-purple-300/50 text-lg font-bold text-center outline-none shadow-[0_0_25px_rgba(245,158,11,0.25)] focus:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all"
                />
              </div>

              {/* Cálculo ao vivo animado */}
              {vibracaoAoVivo && (
                <div className="p-3.5 rounded-xl bg-purple-950/80 border border-amber-400/40 text-center animate-fadeIn space-y-1">
                  <div className="text-xs text-purple-200">
                    Soma Pitagórica para <span className="text-amber-300 font-bold">"{nomeUsuario}"</span>:
                  </div>
                  <div className="text-base font-black text-amber-300 flex items-center justify-center gap-2">
                    <span>✨ Frequência de Vibração: Nº {vibracaoAoVivo} ✨</span>
                  </div>
                  <div className="text-[11px] text-purple-300/80">
                    {ARQUETIPOS_NUMEROLOGICOS[vibracaoAoVivo]?.nome || 'Arquétipo da Alma Identificado'}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!nomeUsuario.trim()}
                className={`w-full group rounded-2xl p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all ${
                  nomeUsuario.trim()
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 opacity-100 active:scale-[0.98]'
                    : 'bg-purple-900/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-[14px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-purple-950 font-black text-base uppercase">
                  <span>DECODIFICAR FREQUÊNCIAS SAGRADAS</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 7 — MESA MÍSTICA: ESCOLHA DAS 3 FREQUÊNCIAS SAGRADAS (CARTAS 3D)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'frequencias' && (
          <section className="flex flex-col items-center animate-fadeIn space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ETAPA 6 DE 6 • SINTONIA FINAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                O Universo filtrou as 8 Frequências Cósmicas para {nomeUsuario || 'você'}:
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80">
                Não pense muito. Escolha <span className="text-amber-300 font-bold">3 Frequências Sagradas</span> que mais chamam a sua intuição:
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-purple-900/70 border border-amber-400/40 text-xs font-extrabold text-amber-300 mt-1">
                🔮 {frequenciasEscolhidas.length} de 3 Frequências Escolhidas
              </div>
            </div>

            {/* Grid 4x2 com as Cartas de Frequência */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md pt-2">
              {FREQUENCIAS_SAGRADAS.map((freq) => {
                const isEscolhida = frequenciasEscolhidas.includes(freq.id);
                const ordem = frequenciasEscolhidas.indexOf(freq.id);

                return (
                  <button
                    key={freq.id}
                    type="button"
                    disabled={isEscolhida || frequenciasEscolhidas.length >= 3}
                    onClick={(e) => handleEscolherFrequencia(freq.id, e)}
                    className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isEscolhida
                        ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-[1.04] ring-2 ring-amber-300'
                        : 'border-purple-600/40 hover:border-amber-400/70 hover:scale-[1.02] shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:scale-95'
                    }`}
                  >
                    {isEscolhida ? (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065] to-[#12072b] p-1 flex flex-col items-center justify-between text-center">
                        <div className="w-5 h-5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px] flex items-center justify-center shadow">
                          {ordem + 1}º
                        </div>
                        <div className="text-xl sm:text-2xl">{freq.icone}</div>
                        <div className="space-y-0.5 w-full">
                          <div className="text-[10px] font-black text-amber-300 truncate w-full">
                            Nº {freq.numero}
                          </div>
                          <div className="text-[8px] text-purple-200/80 truncate w-full">
                            {freq.titulo}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#230f4e] via-[#160a33] to-[#0c051f] flex flex-col items-center justify-center p-2">
                        <div className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-300 font-extrabold text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                          {freq.numero}
                        </div>
                        <span className="text-[9px] font-bold text-purple-200/80 mt-1 text-center">
                          {freq.titulo.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 8 — CÂMARA DE DECODIFICAÇÃO (ANÁLISE HIPNÓTICA 0 A 100%)
           ───────────────────────────────────────────────────────────── */}
        {etapa === 'analise' && (
          <section className="flex flex-col items-center text-center animate-fadeIn space-y-6">
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-2xl animate-pulse" />
              <div className="w-28 h-28 rounded-full border-2 border-amber-400/60 border-t-amber-300 animate-spin flex items-center justify-center p-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-[#190b38]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-purple-600 to-amber-600 flex items-center justify-center text-3xl shadow-inner animate-pulse">
                  🔮
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                DECODIFICANDO MAPA NUMEROLÓGICO
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Cruzando suas frequências cósmicas...
              </h2>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                {analiseProgresso}%
              </div>
            </div>

            {/* Etapas animadas de decodificação */}
            <div className="w-full max-w-sm space-y-2.5 text-left text-xs font-medium">
              <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${analisePasso >= 1 ? 'bg-purple-900/60 border-amber-400/50 text-amber-200 shadow' : 'bg-purple-950/30 border-purple-900/30 text-purple-300/40'}`}>
                {analisePasso >= 1 ? <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-purple-400/30 animate-spin shrink-0" />}
                <span>Decodificando vibração sonora do nome de <strong>{nomeUsuario || 'Você'}</strong></span>
              </div>

              <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${analisePasso >= 2 ? 'bg-purple-900/60 border-amber-400/50 text-amber-200 shadow' : 'bg-purple-950/30 border-purple-900/30 text-purple-300/40'}`}>
                {analisePasso >= 2 ? <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-purple-400/30 animate-spin shrink-0" />}
                <span>Calculando Ano Pessoal de 2026 e matriz kármica</span>
              </div>

              <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${analisePasso >= 3 ? 'bg-purple-900/60 border-amber-400/50 text-amber-200 shadow' : 'bg-purple-950/30 border-purple-900/30 text-purple-300/40'}`}>
                {analisePasso >= 3 ? <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-purple-400/30 animate-spin shrink-0" />}
                <span>Sintonizando as 3 Frequências Cósmicas escolhidas</span>
              </div>

              <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${analisePasso >= 4 ? 'bg-purple-900/60 border-amber-400/50 text-amber-200 shadow' : 'bg-purple-950/30 border-purple-900/30 text-purple-300/40'}`}>
                {analisePasso >= 4 ? <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-purple-400/30 animate-spin shrink-0" />}
                <span>Gerando chave de destravamento e leitura sagrada</span>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PÁGINA 9 — TELA DE REVELAÇÃO DA LEITURA & VSL COM DELAYED CTA
           ───────────────────────────────────────────────────────────── */}
        {isVsl && (
          <section className="flex flex-col items-center text-center animate-fadeIn w-full h-full justify-between gap-2">
            {/* Topo personalizado com Nome & Número do Usuário */}
            <div className="space-y-1 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-extrabold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>LEITURA NUMEROLÓGICA DE 2026 PRONTA</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                {nomeUsuario ? `${nomeUsuario.toUpperCase()}, SUA LEITURA SAGRADA FOI REVELADA:` : 'SUA LEITURA SAGRADA FOI REVELADA:'}
              </h1>
            </div>

            {/* Player de Vídeo VSL */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center">
              <VideoEmbedPlayer
                url={config.quizVsl2Url || config.vslUrl}
                aspect={config.quizVslAspectRatio || '4:5'}
                onIniciado={() => setVslIniciada(true)}
              />
            </div>

            {/* Resumo do Mapa Numerológico do Usuário */}
            <div className="w-full max-w-sm p-2 rounded-xl bg-purple-950/80 border border-amber-500/30 text-left shrink-0 text-[11px] space-y-1">
              <div className="flex justify-between items-center text-amber-300 font-bold border-b border-purple-800/50 pb-1">
                <span>✦ Consulente: {mapaCalculado.nomeLimpo}</span>
                <span>Ano Pessoal: Nº {mapaCalculado.anoPessoal}</span>
              </div>
              <div className="text-purple-200/90 flex justify-between">
                <span>Arquétipo: <strong>{mapaCalculado.arquetipo.nome}</strong></span>
                <span className="text-amber-400 font-bold">Vibração Nº {mapaCalculado.numFinal}</span>
              </div>
            </div>

            {/* Botão CTA com atraso inteligente para o Checkout */}
            <div className="w-full max-w-md shrink-0 pt-1">
              {mostrarCtaVsl ? (
                <button
                  type="button"
                  onClick={handleAbrirCheckout}
                  className="w-full group overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-bounce active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-[14px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-purple-950 font-black text-sm sm:text-base tracking-wide uppercase">
                    <span>{config.quizVsl2CtaTexto || config.vslCtaTexto || 'QUERO ATIVAR A MINHA FREQUÊNCIA DE ABUNDÂNCIA'}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ) : (
                <div className="text-center py-1 text-xs text-purple-300/80 flex items-center justify-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Assista até o final para a liberação da sua Chave Sagrada</span>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* Pop-up de Prova Social ao Vivo */}
      <SocialProofToast />
    </div>
  );
}
