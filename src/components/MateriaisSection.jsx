import React, { useState } from 'react';
import { Package, Search, Sparkles, Lock } from 'lucide-react';

export default function MateriaisSection({
  config,
  onSelecionarMaterial,
}) {
  const [busca, setBusca] = useState('');

  const lista = (config.materials || []).filter((item) => {
    const termo = busca.trim().toLowerCase();
    return (
      !termo ||
      item.title.toLowerCase().includes(termo) ||
      item.description.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="animate-rise space-y-4">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-xl font-bold font-mystic text-amber-300 md:text-2xl">
          <Package className="h-6 w-6 text-amber-400" />
          {config.materiaisTitulo || 'Materiais & Oferendas do Altar'}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-purple-200/80 leading-relaxed">
          {config.materiaisSubtitulo || 'Não cobro pela mão de obra. O valor refere-se apenas aos materiais do santuário. Liberação imediata após a solicitação.'}
        </p>
      </div>

      {/* Busca rápida */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar material do altar..."
          className="w-full rounded-xl border border-amber-500/30 bg-purple-950/80 py-2 pr-4 pl-9 text-xs text-amber-100 placeholder-purple-300/50 outline-none focus:border-amber-400 transition"
        />
      </div>

      {/* Grade Compacta de Materiais */}
      {lista.length === 0 ? (
        <p className="rounded-xl border border-amber-500/20 bg-purple-950/50 p-6 text-center text-xs text-purple-200/60">
          Nenhum material encontrado com esse nome.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {lista.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/30 bg-purple-950/70 p-4 transition-all hover:border-amber-400/60 hover:shadow-lg mystic-card-hover space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold font-mystic text-white group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {item.category || 'Altar'}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-purple-200/80">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelecionarMaterial(item)}
                className="w-full py-2.5 px-3 rounded-xl btn-shimmer-gold text-purple-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200"
              >
                <span>Solicitar Este Material</span>
                <Sparkles className="h-3.5 w-3.5 fill-purple-950" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
