import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { STORAGE } from '../config';

// ─────────────────────────────────────────────────────────────
//  RÉPLICA EXATA & VSL CINEMÁTICA — TESTE XAMÂNICO
// ─────────────────────────────────────────────────────────────

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DECADAS = [
  1910, 1920, 1930, 1940, 1950,
  1960, 1970, 1980, 1990, 2000, 2010
];

const ESTADOS_CIVIS = [
  { id: 'casado', nome: 'Casado(a)', img3d: '/quiz-assets/3d/smart-ring.webp' },
  { id: 'relacionamento', nome: 'Em um relacionamento', img3d: '/quiz-assets/3d/couple.webp' },
  { id: 'solteiro', nome: 'Solteiro(a)', img3d: '/quiz-assets/3d/butterfly.webp' },
  { id: 'noivo', nome: 'Noivo(a)', img3d: '/quiz-assets/3d/engagement.webp' },
  { id: 'divorciado', nome: 'Divorciado(a)', img3d: '/quiz-assets/3d/dove.webp' },
  { id: 'viuvo', nome: 'Viúvo(a)', img3d: '/quiz-assets/3d/candle.webp' },
];

const DESAFIOS = [
  {
    id: 'financeiro',
    nome: 'Financeiro',
    desc: 'Dívidas, escassez ou falta de dinheiro',
    img3d: '/quiz-assets/citrino-3d.webp',
  },
  {
    id: 'amoroso',
    nome: 'Amoroso',
    desc: 'Relacionamento, término ou desilusões',
    img3d: '/quiz-assets/3d/broken-heart.webp',
  },
  {
    id: 'saude',
    nome: 'Saúde & Disposição',
    desc: 'Cansaço físico, estresse e ansiedade',
    img3d: '/quiz-assets/3d/hourglass.webp',
  },
  {
    id: 'espiritual',
    nome: 'Espiritual',
    desc: 'Falta de direção, inveja e energias pesadas',
    img3d: '/quiz-assets/3d/praying.webp',
  },
];

export default function QuizXamanico({ config, variationId = 'v1', onConcluir }) {
  const quizStorageKey = `${STORAGE.quizEstado}_xam_${variationId}`;

  // Passos: 'mes' -> 'dia' -> 'decada' -> 'ano' -> 'civil' -> 'desafio' -> 'sexo' -> 'nome' -> 'analise' -> 'vsl'
  const [passo, setPasso] = useState('mes');

  // Dados coletados
  const [mesNascimento, setMesNascimento] = useState(null);
  const [diaNascimento, setDiaNascimento] = useState(null);
  const [decadaNascimento, setDecadaNascimento] = useState(null);
  const [anoNascimento, setAnoNascimento] = useState(null);
  const [estadoCivil, setEstadoCivil] = useState(null);
  const [desafioPrincipal, setDesafioPrincipal] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  // Análise animada
  const [progressoAnalise, setProgressoAnalise] = useState(0);

  // VSL states
  const [segundosVsl, setSegundosVsl] = useState(0);
  const vslTimestampInicioRef = useRef(null);

  const isVsl = passo === 'vsl';

  useEffect(() => {
    document.body.style.backgroundColor = '#0b1626';
    try {
      localStorage.removeItem(quizStorageKey);
    } catch (e) {}
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [quizStorageKey]);

  // Lista dos 10 anos da década
  const anosDaDecada = useMemo(() => {
    if (!decadaNascimento) return [];
    return Array.from({ length: 10 }, (_, i) => decadaNascimento + i);
  }, [decadaNascimento]);

  // Dias 01 a 31
  const diasDoMes = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  }, []);

  // Handlers
  const handleSelecionarMes = (mes) => {
    setMesNascimento(mes);
    setPasso('dia');
  };

  const handleSelecionarDia = (dia) => {
    setDiaNascimento(dia);
    setPasso('decada');
  };

  const handleSelecionarDecada = (dec) => {
    setDecadaNascimento(dec);
    setPasso('ano');
  };

  const handleSelecionarAno = (ano) => {
    setAnoNascimento(ano);
    setPasso('civil');
  };

  const handleSelecionarCivil = (civilId) => {
    setEstadoCivil(civilId);
    setPasso('desafio');
  };

  const handleSelecionarDesafio = (desafioId) => {
    setDesafioPrincipal(desafioId);
    setPasso('sexo');
  };

  const handleSelecionarSexo = (sexoValor) => {
    setSexo(sexoValor);
    setPasso('nome');
  };

  const handleContinuarNome = (e) => {
    if (e) e.preventDefault();
    if (!nome.trim()) return;
    setPasso('analise');
  };

  // Análise
  useEffect(() => {
    if (passo !== 'analise') return undefined;
    setProgressoAnalise(0);

    const interval = setInterval(() => {
      setProgressoAnalise((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const inc = Math.floor(Math.random() * 10) + 5;
        return Math.min(100, prev + inc);
      });
    }, 100);

    const timerFinal = setTimeout(() => {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
      setPasso('vsl');
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timerFinal);
    };
  }, [passo]);

  // Cronômetro da VSL
  useEffect(() => {
    if (!isVsl) return undefined;
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

  const handleAbrirCheckoutComEmail = (e) => {
    if (e) e.preventDefault();

    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: 'Safira Oráculo - Teste Xamânico',
          currency: 'BRL',
          value: 40.00,
        });
      }
    } catch (err) {}

    const destinoBase = (config.quizVsl2CtaUrl || config.vslCtaUrl || config.checkoutUrl || 'https://ggcheckout.app/checkout/v5/K5qJrW0VINjwRkiJydnl').trim();
    if (destinoBase) {
      try {
        const urlParams = window.location.search;
        const searchParams = urlParams ? new URLSearchParams(urlParams) : new URLSearchParams();
        searchParams.delete('delay');
        searchParams.delete('cta');
        searchParams.delete('teste');
        searchParams.delete('debug');

        if (nome.trim()) searchParams.set('name', nome.trim());
        if (email.trim()) searchParams.set('email', email.trim());

        const finalParams = searchParams.toString();
        if (finalParams) {
          const separator = destinoBase.includes('?') ? '&' : '?';
          window.location.href = `${destinoBase}${separator}${finalParams}`;
          return;
        }
      } catch (err) {}

      window.location.href = destinoBase;
    }
  };

  const isDebugCta = typeof window !== 'undefined' && (
    window.location.search.includes('delay=0') ||
    window.location.search.includes('cta=0') ||
    window.location.search.includes('teste=1') ||
    window.location.search.includes('debug=1')
  );

  const vslDelaySegundos = isDebugCta ? 0 : Number(config.quizVsl2Delay ?? config.vslCtaSegundo ?? 1027);
  const mostrarCtaVsl = vslDelaySegundos === 0 || segundosVsl >= vslDelaySegundos;

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_#122847_0%,_#0b1626_60%,_#050b14_100%)] text-white font-['Sora',sans-serif] flex flex-col items-center justify-center p-3 sm:p-6 select-none relative overflow-x-hidden">
      
      {/* Luz ambiente sutil que harmoniza com a VSL */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(70,130,180,0.15)_0%,_transparent_70%)]" />

      {/* Container Principal */}
      <div className={`relative z-10 w-full ${isVsl ? 'max-w-[420px]' : 'max-w-[580px]'} mx-auto bg-[#173352]/90 backdrop-blur-md text-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-blue-300/25 overflow-hidden flex flex-col transition-all`}>
        
        {/* Header — Dinâmico para Quiz vs VSL */}
        {!isVsl ? (
          <div className="px-5 pt-7 pb-4 text-center border-b border-white/10 bg-[#1e4269]/70">
            <p className="text-xl sm:text-2xl font-black uppercase tracking-wider text-yellow-300 mb-2 leading-tight drop-shadow">
              TESTE XAMÂNICO GRÁTIS
            </p>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed max-w-lg mx-auto">
              Clique abaixo no <b>SEU MÊS DE NASCIMENTO</b> e inicie seu <b>TESTE PERSONALIZADO</b> para descobrir o atalho para ter um 2026 abundante no Amor, Saúde, Sorte e Finanças!
            </p>
          </div>
        ) : (
          <div className="px-5 pt-6 pb-4 text-center border-b border-white/10 bg-[#1e4269]/70">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span>✦ LEITURA REVELADA ✦</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white leading-tight">
              {nome ? `${nome.toUpperCase()}, SUA ORIENTAÇÃO ESTÁ PRONTA:` : 'SUA ORIENTAÇÃO ESTÁ PRONTA:'}
            </h2>
            <p className="text-xs text-blue-200 mt-1">
              Assista ao vídeo sagrado abaixo até o final para destravar seus caminhos.
            </p>
          </div>
        )}

        {/* Corpo do Quiz (.form-container) */}
        <div className="px-4 pb-7 pt-5 flex flex-col items-center w-full min-h-[360px] justify-center">

          {/* ─── PASSO 1: MÊS DE NASCIMENTO ──────────────────────── */}
          {passo === 'mes' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base tracking-wide uppercase text-yellow-300">
                CLIQUE NO SEU MÊS DE NASCIMENTO
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full list-none p-0 m-0">
                {MESES.map((mes) => (
                  <li key={mes} className="w-full">
                    <button
                      type="button"
                      onClick={() => handleSelecionarMes(mes)}
                      className="w-full py-3.5 px-3 rounded-xl bg-white text-[#122847] font-extrabold text-sm sm:text-base hover:bg-yellow-300 hover:text-slate-950 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-center cursor-pointer border-0"
                    >
                      {mes}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ─── PASSO 2: DIA DO NASCIMENTO ──────────────────────── */}
          {passo === 'dia' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base text-white">
                Informe o Dia do seu Nascimento:
              </p>
              <ul className="grid grid-cols-6 sm:grid-cols-7 gap-2 w-full max-h-[300px] overflow-y-auto p-1 list-none m-0">
                {diasDoMes.map((dia) => (
                  <li key={dia}>
                    <button
                      type="button"
                      onClick={() => handleSelecionarDia(dia)}
                      className="w-full py-2.5 rounded-lg bg-white text-[#122847] font-bold text-sm hover:bg-yellow-300 transition-all shadow-sm active:scale-95 text-center cursor-pointer border-0"
                    >
                      {dia}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPasso('mes')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 3: DÉCADA DE NASCIMENTO ───────────────────── */}
          {passo === 'decada' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base text-white">
                Em qual Década você nasceu?
              </p>
              <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 w-full list-none p-0 m-0">
                {DECADAS.map((dec) => (
                  <li key={dec}>
                    <button
                      type="button"
                      onClick={() => handleSelecionarDecada(dec)}
                      className="w-full py-3.5 px-2 rounded-xl bg-white text-[#122847] font-bold text-sm sm:text-base hover:bg-yellow-300 transition-all shadow-sm active:scale-95 text-center cursor-pointer border-0"
                    >
                      {dec}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPasso('dia')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 4: ANO EXATO DE NASCIMENTO ────────────────── */}
          {passo === 'ano' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base text-white">
                Em que Ano você nasceu?
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full list-none p-0 m-0">
                {anosDaDecada.map((ano) => (
                  <li key={ano}>
                    <button
                      type="button"
                      onClick={() => handleSelecionarAno(ano)}
                      className="w-full py-3.5 px-2 rounded-xl bg-white text-[#122847] font-bold text-sm sm:text-base hover:bg-yellow-300 transition-all shadow-sm active:scale-95 text-center cursor-pointer border-0"
                    >
                      {ano}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPasso('decada')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 5: ESTADO CIVIL ───────────────────────────── */}
          {passo === 'civil' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base text-white">
                Qual é o seu Estado Civil?
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {ESTADOS_CIVIS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelecionarCivil(item.id)}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-[#122847] font-extrabold text-sm hover:bg-yellow-300 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95 text-center gap-1.5 cursor-pointer border-0"
                  >
                    <img
                      src={item.img3d}
                      alt={item.nome}
                      width="44"
                      height="44"
                      loading="lazy"
                      decoding="async"
                      className="w-11 h-11 object-contain drop-shadow"
                    />
                    <span>{item.nome}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPasso('ano')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 6: MAIOR DESAFIO ──────────────────────────── */}
          {passo === 'desafio' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-center font-bold text-sm sm:text-base text-white">
                Qual o maior desafio da sua vida nesse momento?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {DESAFIOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelecionarDesafio(item.id)}
                    className="flex items-start p-3.5 rounded-2xl bg-white text-slate-800 font-bold text-left hover:bg-yellow-300 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95 gap-3 cursor-pointer border-0"
                  >
                    <img
                      src={item.img3d}
                      alt={item.nome}
                      width="40"
                      height="40"
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 object-contain shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="text-sm font-black text-[#122847]">{item.nome}</div>
                      <div className="text-xs text-slate-600 font-normal leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPasso('civil')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 7: SEXO ───────────────────────────────────── */}
          {passo === 'sexo' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <h3 className="text-center font-bold text-base sm:text-lg text-white">
                Qual é o seu sexo?
              </h3>
              <div className="flex gap-4 w-full max-w-sm justify-center">
                <button
                  type="button"
                  onClick={() => handleSelecionarSexo('Masculino')}
                  className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-[#122847] font-black text-base hover:bg-yellow-300 transition-all shadow-md active:scale-95 gap-2 cursor-pointer border-0"
                >
                  <img
                    src="/quiz-assets/3d/boy.webp"
                    alt="Masculino"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-contain"
                  />
                  <span>Masculino</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelecionarSexo('Feminino')}
                  className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-[#122847] font-black text-base hover:bg-yellow-300 transition-all shadow-md active:scale-95 gap-2 cursor-pointer border-0"
                >
                  <img
                    src="/quiz-assets/3d/woman.webp"
                    alt="Feminino"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-contain"
                  />
                  <span>Feminino</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPasso('desafio')}
                className="mt-2 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </div>
          )}

          {/* ─── PASSO 8: PRIMEIRO NOME ──────────────────────────── */}
          {passo === 'nome' && (
            <form onSubmit={handleContinuarNome} className="w-full max-w-md flex flex-col items-center space-y-4">
              <h3 className="text-center font-bold text-lg sm:text-xl text-white">
                Qual é o seu Primeiro Nome?
              </h3>
              <div className="w-full">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome"
                  autoFocus
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 text-base font-bold text-center outline-none shadow-inner border-0 focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <button
                type="submit"
                disabled={!nome.trim()}
                className="w-full py-4 px-6 rounded-xl font-black text-base uppercase text-white shadow-xl transition-all active:scale-95 animate-pulse cursor-pointer border-0"
                style={{ background: 'rgb(25, 161, 11)' }}
              >
                Clique Aqui Para Continuar!
              </button>
              <button
                type="button"
                onClick={() => setPasso('sexo')}
                className="mt-1 text-xs text-blue-200 hover:text-yellow-300 font-semibold cursor-pointer border-0 bg-transparent"
              >
                &lt; Voltar
              </button>
            </form>
          )}

          {/* ─── PASSO 9: ANÁLISE HIPNÓTICA RÁPIDA ───────────────── */}
          {passo === 'analise' && (
            <div className="w-full flex flex-col items-center text-center space-y-4 py-6">
              <div className="w-14 h-14 rounded-full border-4 border-white/30 border-t-yellow-300 animate-spin" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Calculando seu Mapa Xamânico...
                </h3>
                <p className="text-xs text-blue-200">
                  Cruzando dados astrológicos para {nome}
                </p>
              </div>
              <div className="text-3xl font-black text-yellow-300">
                {progressoAnalise}%
              </div>
            </div>
          )}

          {/* ─── PASSO 10: VSL OFICIAL COM O IFRAME TYNK 9:16 VERTICAL ────── */}
          {passo === 'vsl' && (
            <div className="w-full max-w-[360px] sm:max-w-[390px] mx-auto flex flex-col items-center text-center space-y-3">
              
              {/* Iframe oficial Tynk AI em formato 9:16 */}
              <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85)] bg-black border border-amber-400/40 relative">
                <iframe
                  src="https://play.tynk.ai/p/4f25520c-50f1-47d3-8778-4449439fe085"
                  style={{ width: '100%', height: '100%', aspectRatio: '9/16', border: 0, display: 'block' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Leitura Xamânica"
                />
              </div>

              {/* Bloco de E-mail + Botão Verde Pulsante no momento do CTA */}
              <div className="w-full pt-1">
                {mostrarCtaVsl ? (
                  <form onSubmit={handleAbrirCheckoutComEmail} className="w-full bg-[#112942]/95 p-4 rounded-2xl border border-amber-400/40 space-y-3 text-center shadow-2xl animate-fadeIn">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm text-yellow-300 font-extrabold leading-snug">
                        Digite o seu e-mail para liberar o restante da sua leitura personalizada e acessar:
                      </p>
                    </div>

                    <div className="w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu melhor Email"
                        required
                        className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 text-sm font-bold text-center outline-none shadow-inner border-0"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-xl font-black text-base uppercase text-white shadow-[0_0_25px_rgba(25,161,11,0.6)] transition-all active:scale-95 animate-bounce cursor-pointer border-0"
                      style={{ background: 'rgb(25, 161, 11)' }}
                    >
                      {config.quizVsl2CtaTexto || config.vslCtaTexto || 'Clique para continuar'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-2 text-xs text-blue-200 font-medium">
                    Assista ao vídeo para a liberação da sua orientação personalizada
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
