import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';

const NOTIFICACOES = [
  { nome: 'Maria S.', local: 'São Paulo - SP', acao: 'acabou de ativar o Código da Abundância ✨', tempo: 'há 15 segundos', icone: '⚡' },
  { nome: 'Juliana R.', local: 'Belo Horizonte - MG', acao: 'garantiu sua vaga no altar sagrado 🔮', tempo: 'há 1 minuto', icone: '🔮' },
  { nome: 'Fernanda M.', local: 'Rio de Janeiro - RJ', acao: 'destravou os caminhos em 2026 🌟', tempo: 'há 2 minutos', icone: '🌟' },
  { nome: 'Patrícia C.', local: 'Curitiba - PR', acao: 'efetuou o pagamento no checkout com sucesso 💳', tempo: 'há 45 segundos', icone: '✅' },
  { nome: 'Camila D.', local: 'Salvador - BA', acao: 'acabou de ativar abundância em sua vida ✨', tempo: 'há 1 minuto', icone: '🔥' },
  { nome: 'Vanessa L.', local: 'Porto Alegre - RS', acao: 'liberou a ativação do seu código sagrado 🎴', tempo: 'há 3 minutos', icone: '🎴' },
  { nome: 'Luciana V.', local: 'Goiânia - GO', acao: 'garantiu 1 das últimas 3 vagas no altar hoje 🕯️', tempo: 'há 2 minutos', icone: '🕯️' },
  { nome: 'Aline P.', local: 'Fortaleza - CE', acao: 'acabou de destravar a prosperidade financeira 💰', tempo: 'há 30 segundos', icone: '⚡' },
];

export default function SocialProofToast({ ativo = true }) {
  const [notificacaoAtual, setNotificacaoAtual] = useState(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!ativo) {
      setVisivel(false);
      return undefined;
    }

    let index = 0;

    const mostrarProxima = () => {
      setNotificacaoAtual(NOTIFICACOES[index]);
      setVisivel(true);

      // Oculta após 4.2 segundos
      setTimeout(() => {
        setVisivel(false);
      }, 4200);

      index = (index + 1) % NOTIFICACOES.length;
    };

    // Primeira notificação surge logo após 1.5s que o botão é liberado
    const timerInicial = setTimeout(mostrarProxima, 1500);

    // Repete a cada 9 segundos
    const interval = setInterval(mostrarProxima, 9000);

    return () => {
      clearTimeout(timerInicial);
      clearInterval(interval);
    };
  }, [ativo]);

  if (!ativo || !notificacaoAtual || !visivel) return null;

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-50 max-w-[340px] pointer-events-none transition-all duration-500 animate-fadeIn">
      <div className="bg-[#190933]/95 backdrop-blur-md border border-amber-400/50 p-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-3 ring-1 ring-white/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-amber-500 border border-amber-300/60 flex items-center justify-center text-amber-100 shrink-0 text-lg shadow-inner animate-pulse">
          {notificacaoAtual.icone}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-extrabold text-amber-300 leading-snug">
            {notificacaoAtual.nome} <span className="text-[10px] text-purple-200 font-normal">({notificacaoAtual.local})</span>
          </p>
          <p className="text-[11px] text-white/90 font-medium leading-tight line-clamp-2">
            {notificacaoAtual.acao}
          </p>
          <div className="flex items-center gap-2 text-[9px] text-emerald-300 font-bold mt-0.5">
            <span className="flex items-center gap-1 text-purple-300/80">
              <Clock className="w-2.5 h-2.5 text-amber-400" /> {notificacaoAtual.tempo}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-emerald-400">
              <CheckCircle2 className="w-2.5 h-2.5" /> Compra Confirmada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
