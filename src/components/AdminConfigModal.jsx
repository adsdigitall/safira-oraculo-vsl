import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, Video, CreditCard, Lock, Plus, Trash2, Code2, Tag, CheckCircle2, DollarSign, Image, Maximize2 } from 'lucide-react';

export default function AdminConfigModal({ isOpen, onClose, config, onSaveConfig, onResetDefaults }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleUpdatePrice = (val) => {
    let valorFormatado = val;
    // Se o usuário digitar apenas número ex "40" ou "65", formata como R$ 40,00
    if (/^\d+$/.test(val.trim())) {
      valorFormatado = `R$ ${val.trim()},00`;
    }

    const novosPlanos = (localConfig.planos || []).map((plano, i) => {
      if (i === 0) return { ...plano, valor: valorFormatado };
      return plano;
    });

    setLocalConfig({
      ...localConfig,
      planosTotal: valorFormatado,
      planosAVista: valorFormatado,
      planos: novosPlanos,
    });
  };

  const handleUpdateCheckoutGlobal = (val) => {
    const materiaisAtualizados = (localConfig.materials || []).map((m) => {
      if (!m.url || m.url.includes('SEU-LINK') || m.url === localConfig.checkoutUrl) {
        return { ...m, url: val };
      }
      return m;
    });

    setLocalConfig({
      ...localConfig,
      checkoutUrl: val,
      materials: materiaisAtualizados,
    });
  };

  const handleUpdateMaterial = (index, field, value) => {
    const novosMateriais = [...(localConfig.materials || [])];
    novosMateriais[index] = { ...novosMateriais[index], [field]: value };
    setLocalConfig({ ...localConfig, materials: novosMateriais });
  };

  const handleRemoveMaterial = (index) => {
    const novosMateriais = (localConfig.materials || []).filter((_, i) => i !== index);
    setLocalConfig({ ...localConfig, materials: novosMateriais });
  };

  const handleAddMaterial = () => {
    const novoItem = {
      id: Date.now(),
      title: 'Novo Material do Altar',
      description: 'Descrição do material.',
      category: 'Altar',
      type: 'request',
      icon: 'sparkles',
      url: localConfig.checkoutUrl || '',
    };
    setLocalConfig({ ...localConfig, materials: [...(localConfig.materials || []), novoItem] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1210]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl mystic-card rounded-2xl border-2 border-amber-500/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden glow-mystic-strong">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1c1210] via-[#2a1e1c] to-amber-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mystic">
                Painel Admin (Configurações & Sincronização)
              </h3>
              <p className="text-xs text-[#cbb8b3]/70">Edite a foto do quiz, o valor da oferta, formato do vídeo, checkouts e Pixel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#2a1e1c]/80 text-amber-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configurações salvas e 100% sincronizadas na nuvem para todos os dispositivos!</span>
            </div>
          )}

          {/* 1. FOTO DA PERSONAGEM DO QUIZ (HERO BANNER INÍCIO DO QUIZ) */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-[#2a1e1c]/80 via-[#1c1210] to-[#2a1e1c]/80 space-y-3 shadow-md">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <Image className="w-4 h-4 text-amber-400" />
              Foto da Personagem / Capa (Início do Quiz)
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={localConfig.quizHeroUrl || ''}
                onChange={(e) => setLocalConfig({ ...localConfig, quizHeroUrl: e.target.value })}
                placeholder="https://exemplo.com/sua-foto.jpg ou cole a URL da imagem"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/40 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition placeholder:text-amber-200/30"
              />

              {localConfig.quizHeroUrl && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400/60 shrink-0 bg-black/50 shadow-lg group">
                  <img
                    src={localConfig.quizHeroUrl}
                    alt="Prévia"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#cbb8b3]/70 leading-relaxed">
              Insira a URL da foto da sua especialista ou personagem. Essa foto é atualizada imediatamente no destaque inicial do Quiz.
            </p>
          </div>

          {/* 2. CAMPO DE EDIÇÃO DO VALOR DA OFERTA / BÔNUS */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#1c1210] to-[#2a1e1c]/60 space-y-2">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Valor / Preço dos Materiais & Oferta (ex: R$ 40,00, R$ 65,00, R$ 97,00)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={localConfig.planosTotal || 'R$ 60,00'}
                onChange={(e) => handleUpdatePrice(e.target.value)}
                placeholder="R$ 60,00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/40 text-amber-300 font-extrabold text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <p className="text-[11px] text-[#cbb8b3]/70">
              Altera automaticamente o valor exibido na aba de solicitação dos materiais e botão de checkout.
            </p>
          </div>

          {/* 3. RASTREAMENTO: META PIXEL FACEBOOK */}
          <div className="space-y-1.5 p-4 rounded-xl border border-amber-500/20 bg-[#1c1210]/60">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <Code2 className="w-4 h-4 text-amber-400" />
              ID do Meta Pixel Facebook (Marcar PageView)
            </label>
            <input
              type="text"
              value={localConfig.pixelId || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, pixelId: e.target.value })}
              placeholder="Ex: 1374470023595160"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
            />
            <p className="text-[10px] text-[#cbb8b3]/60">Dispara automaticamente o evento PageView para rastrear visitantes do Facebook Ads.</p>
          </div>

          {/* 4. LINK DA VSL E CHECKOUT PRINCIPAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
                <Video className="w-4 h-4 text-amber-400" />
                Link da VSL (Tynk AI, YouTube, Vimeo, MP4)
              </label>
              <input
                type="text"
                value={localConfig.vslUrl || ''}
                onChange={(e) => setLocalConfig({ ...localConfig, vslUrl: e.target.value })}
                placeholder="https://play.tynk.ai/p/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Link de Checkout Principal
              </label>
              <input
                type="text"
                value={localConfig.checkoutUrl || ''}
                onChange={(e) => handleUpdateCheckoutGlobal(e.target.value)}
                placeholder="https://pay.cakto.com.br/SUA-OFERTA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* 5. PROPORÇÃO DA TELINHA DO VÍDEO (ASPECT RATIO) */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[#1c1210]/70 space-y-2">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <Maximize2 className="w-4 h-4 text-amber-400" />
              Proporção da Telinha do Vídeo (Para Testar Qual Converte Melhor)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: '16:9', label: '16:9 (Paisagem)', desc: 'Horizontal padrão (380px)' },
                { id: '4:5', label: '4:5 (Vertical 4:5)', desc: 'Ideal Feed / Instagram' },
                { id: '9:16', label: '9:16 (Reels/TikTok)', desc: 'Tela cheia vertical' },
              ].map((fmt) => {
                const ativo = (localConfig.vslAspectRatio || '16:9') === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, vslAspectRatio: fmt.id })}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      ativo
                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md font-bold'
                        : 'bg-[#2a1e1c]/40 border-amber-500/20 text-[#cbb8b3]/70 hover:border-amber-400/40 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold font-mystic">{fmt.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. GERENCIADOR DE MATERIAIS & LINKS INDIVIDUAIS */}
          <div className="space-y-3 pt-2 border-t border-amber-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
                <Tag className="w-4 h-4 text-amber-400" />
                Materiais Exibidos na Página (Edite os Links ou Exclua)
              </label>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Material
              </button>
            </div>

            <div className="space-y-3">
              {(localConfig.materials || []).map((mat, idx) => (
                <div
                  key={mat.id || idx}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-[#1c1210]/80 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={mat.title || ''}
                      onChange={(e) => handleUpdateMaterial(idx, 'title', e.target.value)}
                      placeholder="Nome do Material"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#2a1e1c]/60 border border-amber-500/30 text-white font-bold text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(idx)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 shrink-0"
                      title="Excluir este material"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-amber-300/80 font-medium">Link do Checkout deste Material:</span>
                    <input
                      type="text"
                      value={mat.url || ''}
                      onChange={(e) => handleUpdateMaterial(idx, 'url', e.target.value)}
                      placeholder={localConfig.checkoutUrl || "https://pay.cakto.com.br/LINK-ESPECIFICO"}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#2a1e1c]/40 border border-amber-500/20 text-white font-mono text-[11px] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-3 py-2 rounded-xl bg-[#1c1210] text-[#d8c3bd] hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-amber-500/20 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restaurar Padrão
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl btn-shimmer-gold text-[#1c1210] font-extrabold text-xs flex items-center gap-2 shadow-lg glow-gold-btn transition uppercase tracking-wide font-mystic"
            >
              <Save className="w-4 h-4" /> SALVAR & SINCRONIZAR PÁGINA
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
