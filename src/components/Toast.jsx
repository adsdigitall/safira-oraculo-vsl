import React from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const aviso = toast.tom === 'aviso';
  const Icone = aviso ? Lock : CheckCircle2;

  return (
    <div className="animate-bounceIn fixed right-4 bottom-4 z-50 max-w-sm sm:right-5 sm:bottom-5">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-[#12121a] p-4 text-xs shadow-2xl ${
          aviso ? 'border-white/15' : 'border-[#8B5CF6]/40 shadow-[#8B5CF6]/20'
        }`}
      >
        <div
          className={`shrink-0 rounded-lg p-1 ${
            aviso ? 'bg-white/10 text-white/70' : 'bg-[#8B5CF6]/20 text-[#c4b5fd]'
          }`}
        >
          <Icone className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-0.5">
          <h5 className="font-bold text-white">{toast.titulo}</h5>
          <p className="leading-snug text-white/60">{toast.mensagem}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar aviso"
          className="p-0.5 text-white/40 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
