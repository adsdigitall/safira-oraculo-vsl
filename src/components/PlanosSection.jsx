import React from 'react';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';

export default function PlanosSection({ config, onComprar }) {
  const valorOferta = config.planosTotal || 'R$ 60,00';

  return (
    <div className="animate-rise space-y-5">
      <h1 className="text-xl font-bold font-mystic text-amber-300 md:text-2xl">
        {config.planosTitulo || 'Solicitação dos Materiais do Altar:'}
      </h1>

      <div className="space-y-3">
        {(config.planos || []).map((item, idx) => (
          <div
            key={item.nome || idx}
            className="rounded-2xl border border-amber-500/30 bg-purple-950/70 p-4 space-y-1.5 mystic-card"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold font-mystic text-white">{item.nome}</span>
              <span className="shrink-0 text-sm font-extrabold text-amber-300 font-mono">{item.valor || valorOferta}</span>
            </div>
            <p className="text-xs leading-relaxed text-purple-200/80">{item.descricao}</p>
          </div>
        ))}
      </div>

      {/* Main Checkout Box Dynamic Price */}
      <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-purple-950 via-purple-900 to-[#07040d] p-6 text-center shadow-2xl glow-mystic-strong space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-purple-200/70 uppercase tracking-wider font-semibold">Valor Único dos Materiais do Santuário:</p>
          <p className="text-3xl font-extrabold text-amber-300 font-mystic">
            {valorOferta}
          </p>
          <p className="text-xs text-amber-400/80 font-medium">Mão de obra 100% gratuita • Início imediato após a confirmação</p>
        </div>

        <button
          type="button"
          onClick={onComprar}
          className="w-full py-4 px-6 rounded-xl btn-shimmer-gold text-purple-950 text-base sm:text-lg font-extrabold shadow-xl glow-gold-btn transition-all hover:scale-[1.02] uppercase font-mystic"
        >
          {config.planosCta ? config.planosCta : `CONFIRMAR SOLICITAÇÃO DOS MATERIAIS (${valorOferta})`}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-purple-200/70">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          {config.planosGarantia || 'Pagamento 100% Seguro pela Plataforma · Liberação Imediata'}
        </p>
      </div>
    </div>
  );
}
