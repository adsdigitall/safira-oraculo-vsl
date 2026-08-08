import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, CheckCircle2, Clock } from 'lucide-react';

const NOTIFICACOES = [
  { nome: 'Ana M.', acao: 'efetuou o pagamento dos materiais de R$ 60', tempo: 'há 2 minutos', icone: '🕯️' },
  { nome: 'Patricia R.', acao: 'iniciou o trabalho no altar com Safira', tempo: 'há 4 minutos', icone: '🔮' },
  { nome: 'Camila F.', acao: 'solicitou o Kit de Velas & Rosas', tempo: 'há 1 minuto', icone: '🔥' },
  { nome: 'Mariana G.', acao: 'entrou na Comunidade de Orações', tempo: 'há 6 minutos', icone: '📿' },
  { nome: 'Juliana K.', acao: 'liberou o Guia de Mensagens & Acompanhamento', tempo: 'há 3 minutos', icone: '📜' },
  { nome: 'Fernanda C.', acao: 'solicitou o Ritual de Abertura Financeira', tempo: 'há 5 minutos', icone: '⚡' },
  { nome: 'Luciana V.', acao: 'efetuou o pagamento do material no checkout', tempo: 'há 2 minutos', icone: '✨' },
];

export default function SocialProofToast() {
  const [notificacaoAtual, setNotificacaoAtual] = useState(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    let index = 0;

    const mostrarProxima = () => {
      setNotificacaoAtual(NOTIFICACOES[index]);
      setVisivel(true);

      // Oculta após 4.5 segundos
      setTimeout(() => {
        setVisivel(false);
      }, 4500);

      index = (index + 1) % NOTIFICACOES.length;
    };

    // Primeira notificação após 3 segundos
    const timerInicial = setTimeout(mostrarProxima, 3000);

    // Loop a cada 11 segundos
    const interval = setInterval(mostrarProxima, 11000);

    return () => {
      clearTimeout(timerInicial);
      clearInterval(interval);
    };
  }, []);

  if (!notificacaoAtual || !visivel) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-bounceIn max-w-xs pointer-events-none">
      <div className="mystic-card bg-[#1c1210]/95 border border-amber-500/40 p-3 rounded-2xl shadow-2xl flex items-center gap-3 glow-gold">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 text-base">
          {notificacaoAtual.icone}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-amber-300 font-mystic truncate">
            {notificacaoAtual.nome} <span className="font-sans font-normal text-[#cbb8b3]">{notificacaoAtual.acao}</span>
          </p>
          <span className="text-[9px] text-[#d8c3bd]/60 font-mono flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-400" /> {notificacaoAtual.tempo} • Vaga Consagrada
          </span>
        </div>
      </div>
    </div>
  );
}
