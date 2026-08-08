import React from 'react';
import { Sparkles, Settings, Menu, Moon, Eye } from 'lucide-react';

export default function Header({ config, onOpenAdmin, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 mystic-nav border-b border-amber-500/20">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1c1210] via-[#2a1e1c] to-amber-950 px-4 py-1.5 text-center text-xs font-semibold text-amber-200 border-b border-amber-500/30 flex items-center justify-center gap-2 shadow-md">
        <Moon className="w-3.5 h-3.5 animate-pulse text-amber-400" />
        <span className="tracking-wide">🔮 SAFIRA ORÁCULO • ESPECIALISTA EM RELACIONAMENTO AMOROSO</span>
        <span className="hidden md:inline bg-[#1c1210]/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono text-[11px]">ALTAR CONSAGRADO</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo / Title Area */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#1c1210]/80 text-amber-300 border border-amber-500/30 hover:bg-[#2a1e1c] transition"
              title="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2a1e1c] via-[#1c1210] to-amber-950 flex items-center justify-center shadow-lg border border-amber-400/40 glow-mystic">
                <span className="text-xl">🔮</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mystic flex items-center gap-1.5">
                    {config.productName || 'Safira Oráculo'}
                  </h1>
                  <span className="bg-amber-500/10 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> VIP
                  </span>
                </div>
                <p className="text-[11px] text-[#cbb8b3]/70 font-medium">Especialista em Relacionamento Amoroso</p>
              </div>
            </div>
          </div>

          {/* Right Action Controls - Painel Admin */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1c1210]/80 hover:bg-[#2a1e1c] border border-amber-500/40 hover:border-amber-400 text-amber-200 text-xs font-semibold transition-all duration-200 group shadow-md"
              title="Painel de Edição do Administrador"
            >
              <Settings className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-all duration-300" />
              <span>Painel Admin</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
