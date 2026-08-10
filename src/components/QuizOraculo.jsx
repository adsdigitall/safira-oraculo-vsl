import React, { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { tocarSomCarta, prepararAudio } from '../lib/somCartas';
import CartaVerso from './CartaVerso';
import { STORAGE } from '../config';

// ─────────────────────────────────────────────────────────────
//  QUIZ DE ENTRADA — Crystal Edition (tela cheia, vidro branco)
//  intro → perguntas → diagnóstico → cartas → revelando → resultado
//  Estado persiste no localStorage: recarregar continua de onde parou.
// ─────────────────────────────────────────────────────────────

function lerEstado(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Aurora() {
  return (
    <>
      <div className="quiz-aurora" aria-hidden>
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80" aria-hidden>
        <span className="quiz-star" style={{ top: '10%', left: '14%' }} />
        <span className="quiz-star" style={{ top: '20%', left: '82%', animationDelay: '0.6s' }} />
        <span className="quiz-star" style={{ top: '52%', left: '9%', animationDelay: '1.1s' }} />
        <span className="quiz-star" style={{ top: '66%', left: '88%', animationDelay: '0.3s' }} />
        <span className="quiz-star" style={{ top: '38%', left: '50%', animationDelay: '1.6s' }} />
      </div>
    </>
  );
}

export default function QuizOraculo({ config, variationId = 'v1', onConcluir }) {
  const perguntas = config.quizPerguntas || [];
  const cartas = config.quizCartas || [];
  const reveladas = config.quizCartasReveladas || [];
  const qtdCartas = Math.min(config.quizCartasQtd || reveladas.length || 3, cartas.length);
  const somAtivo = config.quizSomAtivo !== false;
  const diagPassos = config.quizDiagPassos || [];

  const quizStorageKey = `${STORAGE.quizEstado}_${variationId}`;

  const salvo = useMemo(() => lerEstado(quizStorageKey), [quizStorageKey]);
  const [etapa, setEtapa] = useState(salvo?.etapa || 'intro');
  const [indicePergunta, setIndicePergunta] = useState(salvo?.indicePergunta || 0);
  const [respostas, setRespostas] = useState(salvo?.respostas || []);
  const [cartasEscolhidas, setCartasEscolhidas] = useState(salvo?.cartasEscolhidas || []);
  const [diagPct, setDiagPct] = useState(0);

  // Persiste o progresso a cada mudança isolado pela chave da variação
  useEffect(() => {
    try {
      localStorage.setItem(
        quizStorageKey,
        JSON.stringify({ etapa, indicePergunta, respostas, cartasEscolhidas })
      );
    } catch (e) {}
  }, [quizStorageKey, etapa, indicePergunta, respostas, cartasEscolhidas]);

  const finalizar = useCallback(() => {
    try {
      localStorage.removeItem(quizStorageKey);
    } catch (e) {}
    onConcluir();
  }, [quizStorageKey, onConcluir]);

  const iniciarPerguntas = useCallback(() => {
    prepararAudio();
    setEtapa('perguntas');
  }, []);

  // ── Perguntas ────────────────────────────────────────────
  const responder = useCallback(
    (opcaoIndex) => {
      prepararAudio();
      const novas = [...respostas];
      novas[indicePergunta] = opcaoIndex;
      setRespostas(novas);
      if (indicePergunta < perguntas.length - 1) {
        setTimeout(() => setIndicePergunta((i) => i + 1), 260);
      } else {
        setTimeout(() => setEtapa('diagnostico'), 260);
      }
    },
    [indicePergunta, perguntas.length, respostas]
  );

  // ── Diagnóstico (contador 0→100) → Cartas ────────────────
  useEffect(() => {
    if (etapa !== 'diagnostico') return;
    setDiagPct(0);
    const inicio = performance.now();
    const dur = 4200;
    let raf;
    const tick = (t) => {
      const p = Math.min(100, Math.round(((t - inicio) / dur) * 100));
      setDiagPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setEtapa('cartas'), 550);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [etapa]);

  // ── Cartas ───────────────────────────────────────────────
  const escolherCarta = useCallback(
    (cartaIndex) => {
      if (cartasEscolhidas.includes(cartaIndex) || cartasEscolhidas.length >= qtdCartas) return;
      
      // Toca o som imediatamente no manipulador de evento síncrono do clique
      if (somAtivo) {
        tocarSomCarta();
      }

      setCartasEscolhidas((atuais) => {
        if (atuais.includes(cartaIndex) || atuais.length >= qtdCartas) return atuais;
        const novas = [...atuais, cartaIndex];
        if (novas.length === qtdCartas) setTimeout(() => setEtapa('revelando'), 850);
        return novas;
      });
    },
    [cartasEscolhidas, qtdCartas, somAtivo]
  );

  // ── Revelando → Resultado ────────────────────────────────
  useEffect(() => {
    if (etapa !== 'revelando') return;
    const t = setTimeout(() => setEtapa('resultado'), 2600);
    return () => clearTimeout(t);
  }, [etapa]);

  useEffect(() => {
    if (etapa !== 'resultado') return;
    try {
      confetti({ particleCount: 80, spread: 85, origin: { y: 0.4 }, colors: ['#d9c396', '#efe4c8', '#cbb079', '#ffffff'] });
    } catch (e) {}
  }, [etapa]);

  const progresso = useMemo(() => {
    const total = perguntas.length + 1;
    if (etapa === 'perguntas') return (indicePergunta / total) * 100;
    if (etapa === 'cartas') return (perguntas.length / total) * 100 + 6;
    return 0;
  }, [etapa, indicePergunta, perguntas.length]);

  // Preload da foto da personagem no navegador em altíssima prioridade
  useEffect(() => {
    if (!config.quizHeroUrl) return;
    const existing = document.querySelector(`link[rel="preload"][href="${config.quizHeroUrl}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = config.quizHeroUrl;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);

    return () => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (e) {}
    };
  }, [config.quizHeroUrl]);

  const logo = config.quizLogoUrl || config.logoUrl;
  const perguntaAtual = perguntas[indicePergunta];

  const R = 54;
  const CIRC = 2 * Math.PI * R;

  return (
    <div
      className="quiz-crystal fixed inset-0 z-50 flex flex-col items-center overflow-x-hidden overflow-y-auto"
      style={{
        padding:
          'max(1.25rem, env(safe-area-inset-top)) 1rem max(1.25rem, env(safe-area-inset-bottom))',
      }}
    >
      <Aurora />

      <div className="relative z-10 my-auto flex w-full max-w-xl flex-col">
        {/* Logo topo */}
        {logo && <img src={logo} alt="Logo" className="mx-auto mt-1 mb-2 h-16 w-auto object-contain md:h-20" />}

        {/* Barra de progresso cristalina */}
        {(etapa === 'perguntas' || etapa === 'cartas') && (
          <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
            <div
              className="h-full rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)] transition-all duration-500"
              style={{
                width: `${progresso}%`,
                background: 'linear-gradient(90deg,#ef4444,#f97316,#f59e0b,#fbbf24,#a3e635)',
              }}
            />
          </div>
        )}

        {/* ── INTRO ─────────────────────────────────────── */}
        {etapa === 'intro' && (
          <div className="quiz-fade lg quiz-painel flex flex-col items-center text-center">
            <p className="font-script quiz-marca text-[#fbbf24]">
              {config.productName || 'Safira Oráculo'}
            </p>
            <h1 className="quiz-titulo font-mystic font-bold leading-tight text-white">
              {config.quizIntroTitulo}
            </h1>
            <div className="quiz-hero relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
              {config.quizHeroUrl ? (
                <img
                  src={config.quizHeroUrl}
                  alt="Personagem"
                  width="300"
                  height="375"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#2a1c1a]/80 to-[#120b0b]/80 px-3 text-[#a39a97]">
                  <span className="text-4xl">🔮</span>
                  <p className="text-[10px] leading-snug">
                    Foto da sua personagem aqui
                    <br />
                    <span className="text-[#fbbf24]">(campo “quizHeroUrl”)</span>
                  </p>
                </div>
              )}
            </div>
            <p className="quiz-apoio text-[#a39a97]">
              {config.quizIntroTexto}{' '}
              <span className="font-semibold text-[#fbbf24]">{config.quizIntroTextoForte}</span>
            </p>
            <button
              type="button"
              onClick={iniciarPerguntas}
              className="btn-shimmer-gold glow-gold-btn quiz-cta w-full rounded-2xl font-extrabold uppercase tracking-wide text-slate-950 transition-transform active:scale-95"
            >
              {config.quizIntroCta}
            </button>
            {config.quizIntroRodape && (
              <p className="quiz-rodape text-[#7a7398]">✨ {config.quizIntroRodape}</p>
            )}
          </div>
        )}

        {/* ── PERGUNTAS ─────────────────────────────────── */}
        {etapa === 'perguntas' && perguntaAtual && (
          <div key={indicePergunta} className="quiz-fade flex flex-col">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[#fbbf24]">
              Pergunta {indicePergunta + 1} de {perguntas.length}
            </p>
            {perguntaAtual.etiqueta && (
              <p className="mb-3 text-center text-sm font-bold text-white">{perguntaAtual.etiqueta}</p>
            )}
            {perguntaAtual.intro && (
              <p className="mb-4 text-center text-base leading-relaxed text-[#a39a97]">{perguntaAtual.intro}</p>
            )}
            <h2 className="mb-6 text-center font-mystic text-2xl font-bold text-white md:text-3xl">
              {perguntaAtual.titulo}
            </h2>
            <div className="flex flex-col gap-3">
              {perguntaAtual.opcoes.map((op, i) => {
                const ativa = respostas[indicePergunta] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => responder(i)}
                    className={`quiz-opcao flex items-center gap-3.5 rounded-2xl text-left font-semibold ${
                      ativa ? 'quiz-opcao--ativa' : ''
                    }`}
                  >
                    <span className="quiz-opcao__ic leading-none">{op.icone}</span>
                    <span className="flex-1">{op.rotulo}</span>
                    <span className="quiz-opcao__seta opacity-40">›</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DIAGNÓSTICO ────────────────────────────────── */}
        {etapa === 'diagnostico' && (
          <div className="quiz-fade lg quiz-painel flex flex-col items-center text-center">
            <div className="quiz-minis flex flex-col">
              {(config.quizTransicaoLinhas || []).map((linha, i) => (
                <p
                  key={i}
                  className="quiz-linha-surge quiz-apoio text-[#a39a97]"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  {linha}
                </p>
              ))}
            </div>

            <div className="quiz-anel relative">
              <svg viewBox="0 0 140 140" className="diag-ring h-full w-full">
                <defs>
                  <linearGradient id="diagGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <circle className="diag-ring__bg" cx="70" cy="70" r={R} fill="none" strokeWidth="9" />
                <circle
                  className="diag-ring__fill"
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  strokeWidth="9"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - diagPct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="quiz-anel__pct font-mystic font-bold text-[#fbbf24]">{diagPct}%</span>
                <span className="quiz-anel__ic pulse-mystic">🔮</span>
              </div>
            </div>

            <div className="quiz-minis flex w-full max-w-xs flex-col text-left">
              {diagPassos.map((passo, i) => {
                const limiar = ((i + 1) / diagPassos.length) * 100;
                const ok = diagPct >= limiar - 4;
                return (
                  <div
                    key={i}
                    className={`diag-passo flex items-center gap-3 ${ok ? 'diag-passo--ok' : 'diag-passo--pendente'}`}
                  >
                    <span className="diag-check text-xs font-bold">{ok ? '✓' : ''}</span>
                    <span className="quiz-apoio text-[#a39a97]">{passo}</span>
                  </div>
                );
              })}
            </div>
            <p className="quiz-apoio font-semibold text-[#fbbf24]">{config.quizTransicaoCarregando}</p>
          </div>
        )}

        {/* ── CARTAS ────────────────────────────────────── */}
        {etapa === 'cartas' && (
          <div className="quiz-fade flex flex-col items-center w-full max-w-full px-0.5 sm:px-2">
            <h2 className="mb-1 text-center font-mystic text-xl font-bold text-white sm:mb-2 sm:text-2xl md:text-3xl">
              {config.quizCartasTitulo}
            </h2>
            <p className="mb-0.5 text-center text-sm font-semibold text-[#fbbf24] sm:text-base md:text-lg">
              {config.quizCartasSubtitulo}
            </p>
            <p className="mb-1 max-w-sm text-center text-xs text-[#a39a97] sm:mb-2 sm:text-sm">
              {config.quizCartasInstrucao}
            </p>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#fbbf24] sm:mb-4">
              {cartasEscolhidas.length} / {qtdCartas} escolhidas
            </p>

            {/* 8 Cartas em formato vertical / retrato (4 colunas x 2 linhas), responsivas e centralizadas */}
            <div className="grid w-full max-w-md sm:max-w-xl md:max-w-2xl grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 mx-auto justify-items-center">
              {cartas.map((carta, i) => {
                const escolhida = cartasEscolhidas.includes(i);
                const ordem = cartasEscolhidas.indexOf(i);
                const bloqueada = !escolhida && cartasEscolhidas.length >= qtdCartas;
                const revelada = escolhida ? reveladas[ordem] : null;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={escolhida || bloqueada}
                    onClick={() => escolherCarta(i)}
                    className={`quiz-carta ${escolhida ? 'quiz-carta--virada' : ''} ${
                      bloqueada ? 'quiz-carta--bloqueada' : ''
                    }`}
                    aria-label={revelada ? revelada.nome : 'Carta oculta'}
                  >
                    {escolhida && <span className="quiz-carta__glow" aria-hidden />}
                    <span className="quiz-carta__inner">
                      <span
                        className={`quiz-carta__face quiz-carta__back ${carta.verso ? 'quiz-carta__back--img' : ''}`}
                        style={carta.verso ? { backgroundImage: `url(${carta.verso})` } : undefined}
                      >
                        {!carta.verso && <CartaVerso simbolo={carta.simbolo} />}
                      </span>
                      <span
                        className={`quiz-carta__face quiz-carta__front ${revelada?.frente ? 'quiz-carta__front--img' : ''}`}
                        style={revelada?.frente ? { backgroundImage: `url(${revelada.frente})` } : undefined}
                      >
                        {revelada && (
                          <>
                            <span className="quiz-carta__num">{ordem + 1}</span>
                            {!revelada.frente && (
                              <span className="text-3xl sm:text-4xl my-auto">{revelada.simbolo}</span>
                            )}
                            <span className="quiz-carta__nome flex items-center justify-center font-mystic font-extrabold text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide px-1 py-1 bg-[#120a0b]/90 border-t border-amber-500/40 w-full text-center mt-auto z-10 shadow-md">
                              {revelada.nome}
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REVELANDO ─────────────────────────────────── */}
        {etapa === 'revelando' && (
          <div className="quiz-fade flex flex-col items-center py-12 text-center">
            <div className="mb-6 text-7xl pulse-mystic">🔮</div>
            <div className="mb-6 flex gap-2">
              <span className="quiz-dot" />
              <span className="quiz-dot" style={{ animationDelay: '0.2s' }} />
              <span className="quiz-dot" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="max-w-xs font-mystic text-xl text-[#fbbf24]">{config.quizRevelandoTexto}</p>
          </div>
        )}

        {/* ── RESULTADO ─────────────────────────────────── */}
        {etapa === 'resultado' && (
          <div className="quiz-fade lg quiz-painel flex flex-col items-center text-center">
            <div className="quiz-selo pulse-mystic">✨</div>
            <span className="quiz-tag rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 font-semibold uppercase tracking-widest text-[#fbbf24]">
              {config.quizResultadoTag}
            </span>
            <h2 className="quiz-titulo font-mystic font-bold text-white">
              {config.quizResultadoTitulo}
            </h2>
            <div className="quiz-minis flex justify-center gap-3 sm:gap-5 my-4">
              {reveladas.slice(0, qtdCartas).map((rev, idx) => (
                <div
                  key={idx}
                  className="quiz-carta__front quiz-carta__mini relative flex flex-col items-center justify-between overflow-hidden rounded-xl border-2 border-amber-400/70 shadow-2xl glow-gold"
                  style={rev?.frente ? { backgroundImage: `url(${rev.frente})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <span className="quiz-carta__num">{idx + 1}</span>
                  {!rev?.frente && <span className="text-4xl my-auto">{rev?.simbolo}</span>}
                  <span className="quiz-carta__nome flex items-center justify-center font-mystic font-extrabold text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide px-1 py-1.5 bg-[#120a0b]/95 border-t border-amber-500/40 w-full text-center mt-auto z-10 shadow-md">
                    {rev?.nome}
                  </span>
                </div>
              ))}
            </div>
            <p className="quiz-apoio max-w-md text-[#a39a97]">{config.quizResultadoTexto}</p>
            <button
              type="button"
              onClick={finalizar}
              className="btn-shimmer-gold glow-gold-btn quiz-cta w-full rounded-2xl font-extrabold uppercase tracking-wide text-slate-950 transition-transform active:scale-95"
            >
              {config.quizResultadoCta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
