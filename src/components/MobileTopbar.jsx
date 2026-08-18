import React from 'react';
import { Menu, Settings } from 'lucide-react';

export default function MobileTopbar({ config, tituloSecao, onAbrirMenu, onAbrirAdmin, isAdmin }) {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-amber-500/30 bg-[#0e061b]/95 px-3 py-2.5 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onAbrirMenu}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c1210]/80 text-amber-300 border border-amber-500/30 transition-colors hover:bg-[#2a1e1c]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {config.logoUrl ? (
        <img
          src={config.logoUrl}
          alt={config.productName}
          width="36"
          height="36"
          loading="lazy"
          decoding="async"
          className="h-9 w-9 rounded-lg object-contain"
        />
      ) : null}

      <span className="text-sm font-bold text-amber-300 font-mystic flex items-center gap-1.5">
        🔮 {config.productName || 'Safira Oráculo'}
      </span>

      {isAdmin && (
        <button
          type="button"
          onClick={onAbrirAdmin}
          aria-label="Configurar página"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#1c1210]/80 text-amber-300 border border-amber-500/30 transition-colors hover:bg-[#2a1e1c]"
        >
          <Settings className="h-4 w-4" />
        </button>
      )}
    </header>
  );
}
