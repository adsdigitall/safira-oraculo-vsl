import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { prepararAudio, tocarSomCarta } from '../lib/somCartas';
import CartaVerso from './CartaVerso';

const TELAS = [
  { pergunta: 'Como você descreveria o momento entre vocês?', opcoes: ['Estamos distantes', 'Existe muita dúvida', 'Temos idas e vindas'], imagens: ['/quiz-assets/3d/purple-heart.webp', '/quiz-assets/3d/crystal-ball.webp', '/quiz-assets/3d/crescent-star.webp'] },
  { pergunta: 'O que mais pesa para você hoje?', opcoes: ['Não saber o que a pessoa sente', 'A falta de conversa', 'O medo de perder essa conexão'], imagens: ['/quiz-assets/3d/crystal-ball.webp', '/quiz-assets/3d/purple-heart.webp', '/quiz-assets/3d/crescent-star.webp'] },
  { pergunta: 'Há quanto tempo você sente essa insegurança?', opcoes: ['Há poucos dias', 'Há algumas semanas', 'Há bastante tempo'], imagens: ['/quiz-assets/3d/crescent-star.webp', '/quiz-assets/3d/crystal-ball.webp', '/quiz-assets/3d/purple-heart.webp'] },
  { pergunta: 'Quando essa pessoa se afasta, como você se sente?', opcoes: ['Ansiosa e sem clareza', 'Com saudade', 'Tentando entender o que aconteceu'], imagens: ['/quiz-assets/3d/purple-heart.webp', '/quiz-assets/3d/crescent-star.webp', '/quiz-assets/3d/crystal-ball.webp'] },
  { pergunta: 'O que você mais deseja compreender agora?', opcoes: ['Se ainda existe sentimento', 'O que está bloqueando a conexão', 'Qual o melhor próximo passo'], imagens: ['/quiz-assets/3d/crystal-ball.webp', '/quiz-assets/3d/purple-heart.webp', '/quiz-assets/3d/crescent-star.webp'] },
];

function Aurora() { return <><div className="quiz-aurora" aria-hidden><span className="b1" /><span className="b2" /><span className="b3" /></div><div className="pointer-events-none absolute inset-0 z-[1] opacity-80" aria-hidden><span className="quiz-star" style={{ top: '10%', left: '14%' }} /><span className="quiz-star" style={{ top: '20%', left: '82%' }} /><span className="quiz-star" style={{ top: '66%', left: '88%' }} /></div></>; }

export default function QuizOraculoNovo({ config }) {
  const cartas = config.quizCartas || [];
  const reveladas = config.quizCartasReveladas || [];
  const [etapa, setEtapa] = useState('inicio');
  const [pergunta, setPergunta] = useState(0);
  const [escolhidas, setEscolhidas] = useState([]);
  const [cartaFinal, setCartaFinal] = useState(null);
  const [segundosVsl, setSegundosVsl] = useState(0);
  const [vslIniciada, setVslIniciada] = useState(false);
  const cartasDoBaralho = cartas.slice(0, 6);
  const totalCartas = Math.min(3, cartasDoBaralho.length, reveladas.length || 3);
  const tela = TELAS[pergunta];
  const pct = etapa === 'pergunta' ? Math.round(((pergunta + 1) / (TELAS.length + 1)) * 100) : etapa === 'preparo' ? 70 : etapa === 'cartas' ? 80 : etapa === 'carta-final' ? 90 : etapa === 'analise' ? 96 : 100;
  useEffect(() => { if (!vslIniciada) return undefined; const id = window.setInterval(() => setSegundosVsl(s => s + 1), 1000); return () => window.clearInterval(id); }, [vslIniciada]);
  useEffect(() => { if (etapa !== 'analise') return undefined; const id = window.setTimeout(() => setEtapa('vsl'), 2600); return () => window.clearTimeout(id); }, [etapa]);
  const responder = useCallback((index) => { prepararAudio(); if (pergunta < TELAS.length - 1) setPergunta(p => p + 1); else setEtapa('preparo'); }, [pergunta]);
  const escolherCarta = useCallback((index) => { if (escolhidas.includes(index) || escolhidas.length >= totalCartas) return; tocarSomCarta(); setEscolhidas(atual => { const prox = [...atual, index]; if (prox.length === totalCartas) window.setTimeout(() => setEtapa('carta-final'), 850); return prox; }); }, [escolhidas, totalCartas]);
  const videoUrl = useMemo(() => (config.quizVslUrl || config.vslUrl || '').trim(), [config.quizVslUrl, config.vslUrl]);
  const abrirCheckout = () => { const url = (config.vslCtaUrl || config.checkoutUrl || '').trim(); if (url) window.open(url, '_blank', 'noopener,noreferrer'); };
  const continuar = () => { if (cartaFinal === null) { setCartaFinal(Math.floor(Math.random() * Math.min(3, reveladas.length))); window.setTimeout(() => setEtapa('analise'), 260); } else setEtapa('analise'); };
  const segundoCta = Number(config.vslCtaSegundo ?? 17);
  const mostrarCta = vslIniciada && segundosVsl >= segundoCta;
  return <div className="quiz-crystal fixed inset-0 z-50 flex flex-col items-center overflow-y-auto px-4 py-6 sm:py-8"><Aurora /><main className="quiz-layout relative z-10 my-auto flex w-full max-w-lg flex-col py-4">
    {etapa !== 'inicio' && <div className="quiz-progress mb-6"><div className="quiz-progress__meta"><span>Sua consulta</span><span>{pct}%</span></div><div className="quiz-progress__track"><div className="quiz-progress__fill transition-all duration-500" style={{ width: `${pct}%` }} /></div></div>}
    {etapa === 'inicio' && <section className="quiz-xquiz-start text-center"><div className="quiz-xquiz-brand"><span className="quiz-xquiz-brand__spark">✦</span>{config.productName || 'Safira Oráculo'}</div><div className="quiz-xquiz-constellation" aria-hidden><span className="quiz-xquiz-constellation__light" /><img className="quiz-xquiz-object quiz-xquiz-object--moon" src="/quiz-assets/3d/crescent-star.webp" alt="" /><img className="quiz-xquiz-object quiz-xquiz-object--heart" src="/quiz-assets/3d/purple-heart.webp" alt="" /><img className="quiz-xquiz-object quiz-xquiz-object--main" src="/quiz-assets/3d/crystal-ball.webp" alt="" /></div><p className="quiz-xquiz-kicker">CONSULTA GUIADA</p><h1 className="quiz-titulo">Vamos olhar com mais clareza para o seu momento?</h1><p className="quiz-apoio">Responda algumas perguntas e, ao final, escolha as cartas da sua consulta.</p><button className="quiz-xquiz-button" onClick={() => setEtapa('pergunta')}>INICIAR MINHA CONSULTA <span aria-hidden>→</span></button><p className="quiz-xquiz-footnote">Online, particular e no seu ritmo</p></section>}
    {etapa === 'pergunta' && <section className="quiz-painel quiz-xquiz-panel"><p className="quiz-xquiz-counter">Pergunta {pergunta + 1} de {TELAS.length}</p><h2 className="quiz-titulo text-center">{tela.pergunta}</h2><div className="mt-5 flex flex-col gap-3">{tela.opcoes.map((opcao, i) => <button key={opcao} className="quiz-opcao quiz-xquiz-option" onClick={() => responder(i)}><span className="quiz-opcao__ic quiz-xquiz-3d"><img src={tela.imagens[i]} alt="" /></span><span className="flex-1">{opcao}</span><span className="quiz-opcao__seta">›</span></button>)}</div></section>}
    {etapa === 'preparo' && <section className="quiz-painel quiz-xquiz-panel text-center"><div className="quiz-xquiz-symbol mx-auto"><img src="/quiz-assets/3d/crystal-ball.webp" alt="" /></div><p className="quiz-apoio">Obrigada por compartilhar um pouco do seu momento.</p><h2 className="quiz-titulo">Escolha as cartas que mais chamarem a sua atenção.</h2><button className="quiz-xquiz-button" onClick={() => setEtapa('cartas')}>ESCOLHER MINHAS CARTAS</button></section>}
    {etapa === 'cartas' && <section className="quiz-xquiz-cards"><h2 className="quiz-titulo text-center">Escolha as cartas da sua consulta</h2><p className="quiz-apoio text-center">Escolha 3 cartas, uma de cada vez.</p><p className="quiz-xquiz-counter text-center">{escolhidas.length} / {totalCartas} cartas escolhidas</p><div className="quiz-card-choice-grid quiz-xquiz-card-grid">{cartasDoBaralho.map((carta, index) => { const ordem = escolhidas.indexOf(index); const rev = ordem >= 0 ? reveladas[ordem] : null; return <button key={`${carta.nome}-${index}`} className={`quiz-carta ${ordem >= 0 ? 'quiz-carta--virada' : ''}`} disabled={ordem >= 0 || escolhidas.length >= totalCartas} onClick={() => escolherCarta(index)}><span className="quiz-carta__inner"><span className="quiz-carta__face quiz-carta__back">{carta.verso ? <img src={carta.verso} alt="Carta fechada" /> : <CartaVerso simbolo={carta.simbolo} />}</span><span className="quiz-carta__face quiz-carta__front">{rev?.frente && <img src={rev.frente} alt={rev.nome} />}{ordem >= 0 && <span className="quiz-carta__num">{ordem + 1}</span>}</span></span></button>; })}</div></section>}
    {etapa === 'carta-final' && <section className="quiz-painel quiz-xquiz-panel text-center"><h2 className="quiz-titulo">Escolha a sua carta:</h2><div className="mt-5 grid grid-cols-3 gap-3">{reveladas.slice(0, 3).map((carta, i) => <button key={carta.nome} onClick={() => setCartaFinal(i)} className={`quiz-xquiz-final-card ${cartaFinal === i ? 'is-selected' : ''}`}><img src={carta.frente} alt={carta.nome} /></button>)}</div><button className="quiz-xquiz-button mt-6" onClick={continuar}>CONTINUAR PARA MINHA LEITURA</button></section>}
    {etapa === 'analise' && <section className="quiz-painel quiz-xquiz-panel quiz-xquiz-analysis text-center"><div className="quiz-xquiz-analysis__orb"><img src="/quiz-assets/3d/crystal-ball.webp" alt="" /></div><p className="quiz-xquiz-label">ANÁLISE EM ANDAMENTO</p><h2 className="quiz-titulo">Estamos preparando sua leitura</h2><p className="quiz-apoio">Cruzando suas respostas e as cartas que você escolheu.</p></section>}
    {etapa === 'vsl' && <section className="quiz-painel quiz-xquiz-panel text-center">
      <h2 className="quiz-titulo">Sua leitura está pronta</h2>
      <div className="quiz-xquiz-video relative overflow-hidden">
        {videoUrl ? (
          <>
            {!vslIniciada && (
              <button
                type="button"
                onClick={() => setVslIniciada(true)}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,_#6f4ee8_0%,_#170a40_42%,_#090411_100%)] text-white"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5c85a] text-[#24104d] shadow-[0_0_34px_rgba(245,200,90,.5)]">
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </span>
                <span className="text-sm font-extrabold tracking-wide">INICIAR VÍDEO</span>
              </button>
            )}
            <iframe
              src={videoUrl}
              title="Vídeo da leitura"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </>
        ) : (
          <button className="quiz-xquiz-play" onClick={() => setVslIniciada(true)}>
            <Play fill="currentColor" /> Iniciar vídeo
          </button>
        )}
      </div>
      <p className="quiz-apoio mt-4">Assista até o final para receber a orientação completa.</p>
      {mostrarCta && (
        <button
          className="quiz-xquiz-button mt-5 fixed bottom-4 left-1/2 z-50 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 shadow-[0_16px_34px_rgba(0,0,0,.45)] sm:static sm:w-full sm:translate-x-0 sm:shadow-[0_10px_24px_rgba(233,186,47,.28),inset_0_1px_rgba(255,255,255,.5)]"
          onClick={abrirCheckout}
        >
          {config.vslCtaTexto || 'SIM, QUERO ATIVAR O CÓDIGO!'}
        </button>
      )}
    </section>}
  </main></div>;
}
