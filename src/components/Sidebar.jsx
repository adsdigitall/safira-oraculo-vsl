import React, { useEffect, useState } from 'react';
import { House, Package, Gift, CreditCard, Lock, X, Sparkles } from 'lucide-react';

const ITENS = [
  { id: 'inicio', rotulo: 'Início', Icone: House, sempreLiberado: true },
  { id: 'materiais', rotulo: 'Materiais', Icone: Package },
  { id: 'bonus', rotulo: 'Bônus', Icone: Gift },
  { id: 'planos', rotulo: 'Planos', Icone: CreditCard, apenasLiberado: true },
];

export default function Sidebar({
  config,
  secaoAtiva,
  onTrocarSecao,
  liberado,
  onClicarBloqueado,
  aberta,
  onFechar,
}) {
  const dica = config.dicaSidebar || '';
  const [digitado, setDigitado] = useState('');

  useEffect(() => {
    setDigitado('');
    if (!dica) return;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setDigitado(dica.slice(0, i));
      if (i >= dica.length) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [dica]);

  const handleCtaClick = () => {
    if (!liberado) {
      onClicarBloqueado();
      return;
    }
    // Quando liberado, abre a seção de Planos (Solicitação dos materiais)
    onTrocarSecao('planos');
    onFechar();
  };

  return (
    <nav
      className={`glass-nav fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-1 px-4 py-6 transition-transform duration-300 ease-out md:sticky md:top-0 md:z-20 md:h-screen md:w-56 md:translate-x-0 ${
        aberta ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo / Branding */}
      <div className="mb-4 flex items-center justify-between md:mb-5 md:block text-center space-y-1">
        {config.logoUrl ? (
          <img
            src={config.logoUrl}
            alt={config.productName}
            className="h-16 w-16 rounded-lg object-contain md:mx-auto md:h-20 md:w-20"
          />
        ) : (
          <div>
            <span className="text-lg leading-tight font-extrabold tracking-tight text-amber-300 font-mystic block text-center md:text-xl">
              🔮 {config.productName || 'Safira Oráculo'}
            </span>
            <span className="text-[10px] text-[#cbb8b3]/70 font-medium block">
              {config.subTitle || 'Especialista em Relacionamento Amoroso'}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-300/70 transition-colors hover:bg-amber-500/10 hover:text-amber-200 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Dica digitada */}
      {digitado && (
        <div className="mb-3 rounded-xl border border-amber-500/30 bg-[#1c1210]/80 px-3 py-2.5 text-[12px] leading-snug text-amber-200 font-medium shadow-sm">
          {digitado}
          {digitado.length < dica.length && <span className="caret bg-amber-400" />}
        </div>
      )}

      {/* Navegação */}
      {ITENS.map(({ id, rotulo, Icone, sempreLiberado, apenasLiberado }) => {
        if (apenasLiberado && !liberado) return null;
        const bloqueado = !liberado && !sempreLiberado;
        const ativo = secaoAtiva === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (bloqueado) {
                onClicarBloqueado();
                return;
              }
              onTrocarSecao(id);
              onFechar();
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all md:py-2.5 ${
              ativo
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : bloqueado
                  ? 'text-[#d8c3bd]/40 hover:bg-[#1c1210]/50 cursor-not-allowed'
                  : 'text-[#cbb8b3]/80 hover:bg-[#1c1210]/80 hover:text-amber-200'
            }`}
          >
            <Icone className="h-4 w-4 text-amber-400" /> {rotulo}
            {bloqueado && <Lock className="ml-auto h-3.5 w-3.5 text-amber-400/40" />}
          </button>
        );
      })}

      {/* CTA principal: Solicitacão Bloqueada durante o Vídeo */}
      <button
        type="button"
        onClick={handleCtaClick}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-xs font-extrabold transition-all ${
          liberado
            ? 'btn-shimmer-gold text-[#1c1210] shadow-lg glow-gold-btn animate-ctaPulse hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-[#1c1210]/60 text-[#d8c3bd]/50 border border-amber-500/20 cursor-not-allowed'
        }`}
      >
        {liberado ? (
          <>
            <Sparkles className="h-4 w-4 fill-[#1c1210]" />
            {config.ctaSidebar || 'Solicitar Materiais'}
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 text-amber-400/60" />
            <span>🔒 Bloqueado durante o vídeo</span>
          </>
        )}
      </button>

      <p className="mt-2 text-center text-[11px] leading-snug text-[#d8c3bd]/50 font-medium">
        Entrega em até 24h úteis
      </p>
    </nav>
  );
}
