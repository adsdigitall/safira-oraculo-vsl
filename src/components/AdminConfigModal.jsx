import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, Video, CreditCard, Lock, Plus, Trash2, Code2, Tag, CheckCircle2, DollarSign, Image, Maximize2, Copy, Layers } from 'lucide-react';

export default function AdminConfigModal({ isOpen, onClose, config, onSaveConfig, onResetDefaults }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [indexVariacaoAtiva, setIndexVariacaoAtiva] = useState(0);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const variacoesList = localConfig.variacoes || [
    {
      id: 'v1',
      slug: '1',
      nome: 'VSL 1 — Principal',
      vslUrl: localConfig.vslUrl || '',
      checkoutUrl: localConfig.checkoutUrl || '',
      vslAspectRatio: localConfig.vslAspectRatio || '16:9',
      planosTotal: localConfig.planosTotal || 'R$ 40,00',
      vslCtaSegundo: localConfig.vslCtaSegundo ?? 17,
      vslCtaTexto: localConfig.vslCtaTexto || 'Quero meu acesso • Inscrever agora',
      vslCtaUrl: localConfig.vslCtaUrl || '',
    },
  ];

  const variacaoAtual = variacoesList[indexVariacaoAtiva] || variacoesList[0];

  const handleUpdateVariacao = (index, field, value) => {
    const novasVariacoes = [...variacoesList];
    novasVariacoes[index] = { ...novasVariacoes[index], [field]: value };

    // Se for a variação ativa index 0, sincroniza também no topo do localConfig
    const extraConfig = index === 0 ? { [field]: value } : {};

    setLocalConfig({
      ...localConfig,
      ...extraConfig,
      variacoes: novasVariacoes,
    });
  };

  const handleDuplicarVariacao = (indexOrigem = 0) => {
    const baseObj = variacoesList[indexOrigem] || variacoesList[0] || {
      vslUrl: localConfig.vslUrl || '',
      checkoutUrl: localConfig.checkoutUrl || '',
      vslAspectRatio: localConfig.vslAspectRatio || '16:9',
      planosTotal: localConfig.planosTotal || 'R$ 40,00',
    };

    const novoNum = variacoesList.length + 1;
    const novaVariacao = {
      id: `v${novoNum}`,
      slug: String(novoNum),
      nome: `VSL ${novoNum} — Teste ${String.fromCharCode(64 + novoNum)}`,
      vslUrl: baseObj.vslUrl || '',
      checkoutUrl: baseObj.checkoutUrl || '',
      vslAspectRatio: baseObj.vslAspectRatio || '16:9',
      planosTotal: baseObj.planosTotal || 'R$ 40,00',
      vslCtaSegundo: baseObj.vslCtaSegundo ?? localConfig.vslCtaSegundo ?? 17,
      vslCtaTexto: baseObj.vslCtaTexto || localConfig.vslCtaTexto || 'Quero meu acesso • Inscrever agora',
      vslCtaUrl: baseObj.vslCtaUrl || localConfig.vslCtaUrl || '',
    };

    const novasVariacoes = [...variacoesList, novaVariacao];
    setLocalConfig({
      ...localConfig,
      variacoes: novasVariacoes,
    });
    setIndexVariacaoAtiva(novasVariacoes.length - 1);
  };

  const handleRemoverVariacao = (index) => {
    if (variacoesList.length <= 1) return;
    const novasVariacoes = variacoesList.filter((_, i) => i !== index);
    setLocalConfig({
      ...localConfig,
      variacoes: novasVariacoes,
    });
    setIndexVariacaoAtiva(Math.max(0, index - 1));
  };

  const handleCopiarUrlVariacao = (varObj, index) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://triagem.site';
    const slug = varObj.slug || index + 1;
    const finalUrl = `${baseUrl}?v=${slug}`;
    navigator.clipboard.writeText(finalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {});
  };

  const handleCopyAdLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://triagem.site';
    const params = new URLSearchParams();
    if (localConfig.vslUrl) params.set('vsl', localConfig.vslUrl);
    if (localConfig.quizHeroUrl) params.set('hero', localConfig.quizHeroUrl);
    if (localConfig.vslAspectRatio && localConfig.vslAspectRatio !== '16:9') params.set('aspect', localConfig.vslAspectRatio);

    const finalUrl = `${baseUrl}?${params.toString()}`;
    navigator.clipboard.writeText(finalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {});
  };

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
                    width="56"
                    height="56"
                    loading="lazy"
                    decoding="async"
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

          {/* BACK-REDIRECT */}
          <div className="space-y-1.5 p-4 rounded-xl border border-amber-500/30 bg-[#1c1210]/60">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Link de Back-Redirect (Ao tentar sair da página)
            </label>
            <input
              type="url"
              value={localConfig.backRedirectUrl || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, backRedirectUrl: e.target.value })}
              placeholder="https://ggcheckout.app/checkout/v5/K5qJrW0VINjwRkiJydnl"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
            />
            <p className="text-[10px] text-[#cbb8b3]/60">Redireciona o visitante para esta oferta caso ele aperte o botão "Voltar" do navegador ou celular.</p>
          </div>

          {/* VÍDEO 1 (VSL 1 - LEITURA DAS CARTAS) */}
          <div className="space-y-3 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
              <Video className="w-4 h-4 text-amber-400" />
              Vídeo 1 (Página 9 — VSL 1 Leitura das Cartas)
            </label>
            <label className="text-[11px] font-bold text-[#cbb8b3]">Link ou Embed do Vídeo 1 (VTurb / Tynk / YouTube / MP4 / iframe)</label>
            <input
              type="text"
              value={localConfig.quizVsl1Url || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, quizVsl1Url: e.target.value })}
              placeholder="Cole o link ou código do vídeo 1 da leitura"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />

            <label className="text-[11px] font-bold text-[#cbb8b3]">Liberar Carta Sagrada / Botão Continuar após</label>
            <div className="flex overflow-hidden rounded-xl border border-amber-500/30 bg-[#1c1210]/90">
              <input
                type="number"
                min="0"
                value={localConfig.quizVsl1Delay ?? 0}
                onChange={(e) => setLocalConfig({ ...localConfig, quizVsl1Delay: Number(e.target.value) })}
                placeholder="460"
                className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
              <span className="flex items-center border-l border-amber-500/20 px-3 text-xs font-bold text-amber-300">segundos (0 = imediato)</span>
            </div>
          </div>

          {/* VÍDEO 2 (VSL 2 - OFERTA & ATIVAÇÃO DO CÓDIGO) */}
          <div className="space-y-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
            <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mystic">
              <Video className="w-4 h-4 text-emerald-400" />
              Vídeo 2 (Página 10 — VSL 2 Oferta & Ativação)
            </label>
            <label className="text-[11px] font-bold text-[#cbb8b3]">Link ou Embed do Vídeo 2 (VTurb / Tynk / YouTube / MP4 / iframe)</label>
            <input
              type="text"
              value={localConfig.quizVsl2Url || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, quizVsl2Url: e.target.value })}
              placeholder="Cole o link ou código do vídeo 2 da oferta"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />

            <label className="text-[11px] font-bold text-[#cbb8b3]">Liberar Botão de Compra após</label>
            <div className="flex overflow-hidden rounded-xl border border-emerald-500/30 bg-[#1c1210]/90">
              <input
                type="number"
                min="0"
                value={localConfig.quizVsl2Delay ?? 0}
                onChange={(e) => setLocalConfig({ ...localConfig, quizVsl2Delay: Number(e.target.value) })}
                placeholder="430"
                className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
              <span className="flex items-center border-l border-emerald-500/20 px-3 text-xs font-bold text-emerald-300">segundos (0 = imediato)</span>
            </div>

            <label className="text-[11px] font-bold text-[#cbb8b3]">Texto do Botão CTA</label>
            <input
              type="text"
              value={localConfig.quizVsl2CtaTexto || 'SIM, QUERO ATIVAR O CÓDIGO!'}
              onChange={(e) => setLocalConfig({ ...localConfig, quizVsl2CtaTexto: e.target.value })}
              placeholder="SIM, QUERO ATIVAR O CÓDIGO!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
            />

            <label className="text-[11px] font-bold text-[#cbb8b3]">Link de Checkout do Botão</label>
            <input
              type="url"
              value={localConfig.quizVsl2CtaUrl || localConfig.checkoutUrl || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, quizVsl2CtaUrl: e.target.value })}
              placeholder="https://lastlink.com/p/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210]/90 border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* 4. GERENCIADOR DE VARIAÇÕES DE VSL & MULTI-CHECKOUT (A/B TESTING) */}
          <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-[#1c1210] to-[#2a1e1c]/80 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mystic">
                <Layers className="w-4 h-4 text-amber-400" />
                Variações de VSL & Multi-Checkout (Testar Ofertas A/B)
              </label>
              <button
                type="button"
                onClick={() => handleDuplicarVariacao(indexVariacaoAtiva)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 hover:scale-105 transition shadow-md w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" /> Duplicar VSL / Nova Variação
              </button>
            </div>

            <p className="text-[11px] text-[#cbb8b3]/70 leading-relaxed">
              Crie variações independentes para testar vídeos VSL e checkouts diferentes. Copie a URL única para rodar nos anúncios.
            </p>

            {/* Abas Seleção das Variações */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-amber-500/20">
              {variacoesList.map((v, idx) => {
                const ativa = indexVariacaoAtiva === idx;
                return (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => {
                      setIndexVariacaoAtiva(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mystic transition flex items-center gap-1.5 shrink-0 ${
                      ativa
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                        : 'bg-[#2a1e1c]/60 text-[#cbb8b3]/70 hover:text-white border border-amber-500/20'
                    }`}
                  >
                    <span>{v.nome || `Variação ${idx + 1}`}</span>
                    <span className="text-[10px] opacity-75 font-mono">({v.slug || idx + 1})</span>
                  </button>
                );
              })}
            </div>

            {/* Painel da Variação Selecionada */}
            {variacaoAtual && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
                  <input
                    type="text"
                    value={variacaoAtual.nome || ''}
                    onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'nome', e.target.value)}
                    placeholder="Nome da Variação (ex: VSL 2 - Checkout Oferta B)"
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1210] border border-amber-500/40 text-amber-200 font-mystic text-xs font-bold focus:outline-none focus:border-amber-400"
                  />

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleCopiarUrlVariacao(variacaoAtual, indexVariacaoAtiva)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition w-full sm:w-auto justify-center shadow-md"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? '✓ Link Copiado!' : `Copiar Link Anúncios (?v=${variacaoAtual.slug || indexVariacaoAtiva + 1})`}</span>
                    </button>

                    {variacoesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoverVariacao(indexVariacaoAtiva)}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
                        title="Excluir Variação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-mystic">
                      <Video className="w-3.5 h-3.5 text-amber-400" />
                      Link da VSL desta Variação
                    </label>
                    <input
                      type="text"
                      value={variacaoAtual.vslUrl || ''}
                      onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'vslUrl', e.target.value)}
                      placeholder="https://play.tynk.ai/p/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210] border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-mystic">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      Link de Checkout desta Variação
                    </label>
                    <input
                      type="text"
                      value={variacaoAtual.checkoutUrl || ''}
                      onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'checkoutUrl', e.target.value)}
                      placeholder="https://pay.cakto.com.br/SUA-OFERTA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210] border border-amber-500/30 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-mystic">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      Preço desta Variação
                    </label>
                    <input
                      type="text"
                      value={variacaoAtual.planosTotal || 'R$ 40,00'}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^\d+$/.test(val.trim())) val = `R$ ${val.trim()},00`;
                        handleUpdateVariacao(indexVariacaoAtiva, 'planosTotal', val);
                      }}
                      placeholder="R$ 40,00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1210] border border-amber-500/30 text-amber-300 font-extrabold text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* Proporção do vídeo por variação */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-mystic mb-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    Proporção do Vídeo desta Variação
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '16:9', label: '16:9 (Paisagem)' },
                      { id: '4:5', label: '4:5 (Vertical 4:5)' },
                      { id: '9:16', label: '9:16 (Reels/TikTok)' },
                    ].map((fmt) => {
                      const ativo = (variacaoAtual.vslAspectRatio || '16:9') === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => handleUpdateVariacao(indexVariacaoAtiva, 'vslAspectRatio', fmt.id)}
                          className={`p-2 rounded-lg border text-center transition text-xs font-bold font-mystic ${
                            ativo
                              ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                              : 'bg-[#2a1e1c]/40 border-amber-500/20 text-[#cbb8b3]/70 hover:text-white'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/25 bg-black/15 p-3 space-y-2.5">
                  <div>
                    <p className="text-[11px] font-bold text-amber-300 font-mystic">Botão programado desta VSL</p>
                    <p className="mt-0.5 text-[10px] text-[#cbb8b3]/65">Cada link de anúncio pode ter seu próprio segundo, texto e destino de checkout.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[135px_1fr]">
                    <label className="text-[11px] font-bold text-[#cbb8b3] sm:pt-2">Exibir CTA após</label>
                    <div className="flex overflow-hidden rounded-xl border border-amber-500/30 bg-[#1c1210]">
                      <input
                        type="number"
                        min="0"
                        value={variacaoAtual.vslCtaSegundo ?? 17}
                        onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'vslCtaSegundo', e.target.value)}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <span className="flex items-center border-l border-amber-500/20 px-3 text-xs font-bold text-amber-300">segundos</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={variacaoAtual.vslCtaTexto || ''}
                    onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'vslCtaTexto', e.target.value)}
                    placeholder="Texto do botão que aparece na VSL"
                    className="w-full rounded-xl border border-amber-500/30 bg-[#1c1210] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={variacaoAtual.vslCtaUrl || ''}
                    onChange={(e) => handleUpdateVariacao(indexVariacaoAtiva, 'vslCtaUrl', e.target.value)}
                    placeholder="Link do CTA (vazio = checkout desta variação)"
                    className="w-full rounded-xl border border-amber-500/30 bg-[#1c1210] px-3 py-2 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
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
          <div className="pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetDefaults}
                className="px-3 py-2 rounded-xl bg-[#1c1210] text-[#d8c3bd] hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-amber-500/20 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restaurar Padrão
              </button>

              <button
                type="button"
                onClick={handleCopyAdLink}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 border border-amber-400/40 transition"
                title="Gera uma URL direta com vídeo e foto embutidos para usar em anúncios de forma 100% garantida"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>{copiedLink ? 'Link Copiado! ⚡' : 'Copiar URL p/ Anúncios'}</span>
              </button>
            </div>

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
