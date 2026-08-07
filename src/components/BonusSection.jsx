import React from 'react';
import { Gift, Sparkles, MessageSquare, Calendar, ShieldCheck, Lock } from 'lucide-react';

export default function BonusSection({ config, onDesbloquear }) {
  const bonusItems = [
    {
      titulo: '🗓️ Acompanhamento de 7 Dias com Safira Oráculo',
      descricao: 'Direcionamento espiritual diário no WhatsApp durante os 7 dias do ritual para orientar suas decisões amorosas.',
      icone: Calendar
    },
    {
      titulo: '💬 Guia Secreto de Mensagens & Respostas',
      descricao: 'Script exato do que mandar para a pessoa amada e como responder conforme cada reação ou atitude dela.',
      icone: MessageSquare
    },
    {
      titulo: '🛡️ Oração em PDF de Proteção Amorosa de Oxum',
      descricao: 'Reza diária de descarrego e blindagem contra inveja, intriga e pessoas falsas.',
      icone: ShieldCheck
    }
  ];

  return (
    <div className="animate-rise space-y-5">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-xl font-bold font-mystic text-amber-300 md:text-2xl">
          <Gift className="h-6 w-6 text-amber-400" />
          {config.bonusTitulo || 'Bônus Exclusivos de Acompanhamento'}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-purple-200/80">
          {config.bonusSubtitulo || 'Liberados imediatamente após a confirmação do seu pedido na plataforma.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {bonusItems.map((item, idx) => {
          const Icone = item.icone;
          return (
            <button
              key={idx}
              type="button"
              onClick={onDesbloquear}
              className="group flex w-full items-start gap-4 rounded-2xl border border-amber-500/30 bg-purple-950/70 p-4 text-left transition-all hover:scale-[1.01] hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/50 sm:p-5 mystic-card-hover"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 sm:h-14 sm:w-14">
                <Icone className="h-6 w-6 text-amber-400 sm:h-7 sm:w-7" />
              </span>

              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-sm sm:text-base font-bold font-mystic text-white group-hover:text-amber-300 transition">
                  {item.titulo}
                </span>
                <span className="text-xs text-purple-200/80 leading-relaxed">{item.descricao}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                  <Sparkles className="h-3 w-3" /> Incluído no seu pedido
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
