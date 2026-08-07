import React from 'react';
import { MessageSquare, ExternalLink, Sparkles, Layers } from 'lucide-react';

export default function SidebarMaterials({ 
  materialsList = [], 
  whatsappSupportLink,
  isMobileOpen,
  onCloseMobile
}) {
  const getWhatsappUrl = (itemTitle) => {
    const text = encodeURIComponent(`Olá Morgana, acabei de ver a VSL no portal e quero solicitar o material: ${itemTitle}`);
    if (whatsappSupportLink && whatsappSupportLink.includes('wa.me')) {
      const baseUrl = whatsappSupportLink.split('?')[0];
      return `${baseUrl}?text=${text}`;
    }
    return `https://wa.me/5547996338716?text=${text}`;
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-[#07040d] border-l border-amber-500/30 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:w-full lg:h-auto lg:shadow-none lg:bg-transparent lg:border-l-0 lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="h-full flex flex-col mystic-card lg:rounded-2xl lg:border lg:border-amber-500/30 overflow-hidden glow-mystic">
        
        {/* Header da Barra Lateral */}
        <div className="p-4 bg-gradient-to-b from-purple-950 to-[#0c0617] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg">
              🔮
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mystic">
                Solicitar Materiais
              </h3>
              <p className="text-[11px] text-purple-200/70">Clique abaixo para solicitar pelo WhatsApp</p>
            </div>
          </div>

          <button 
            onClick={onCloseMobile} 
            className="lg:hidden p-1.5 rounded-lg bg-purple-900/80 text-amber-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Lista Enxuta de Materiais */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {materialsList.map((item) => (
            <div
              key={item.id}
              className="bg-purple-950/70 rounded-xl p-3.5 border border-amber-500/20 hover:border-amber-400/60 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white font-mystic group-hover:text-amber-300 transition">
                  {item.title}
                </h4>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  {item.category || 'Materiais'}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Botão Direto para o WhatsApp */}
              <a
                href={getWhatsappUrl(item.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Solicitar no WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer Direto com WhatsApp Geral */}
        <div className="p-4 bg-purple-950/90 border-t border-amber-500/30">
          <a
            href={whatsappSupportLink || "https://wa.me/5547996338716?text=Ol%C3%A1%20Morgana%2C%20quero%20solicitar%20os%20materiais%20do%20portal"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl btn-shimmer-gold text-purple-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg glow-gold-btn"
          >
            <Sparkles className="w-4 h-4 fill-purple-950" />
            <span className="uppercase font-mystic">FALAR COM A MORGANA NO WHATSAPP</span>
          </a>
        </div>

      </div>
    </aside>
  );
}
