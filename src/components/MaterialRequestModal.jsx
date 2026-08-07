import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, CheckCircle2, FileText, Phone, User, MessageSquare, AlertCircle, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MaterialRequestModal({ isOpen, onClose, selectedMaterial, onSubmitRequest }) {
  const [formData, setFormData] = useState({
    requestType: selectedMaterial ? selectedMaterial.title : '🔮 Ritual de Limpeza Amorosa',
    userName: '',
    whatsapp: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');

  useEffect(() => {
    if (selectedMaterial) {
      setFormData(prev => ({ ...prev, requestType: selectedMaterial.title }));
    }
  }, [selectedMaterial]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.whatsapp) return;

    const newProtocol = Math.floor(100000 + Math.random() * 900000).toString();
    setProtocol(newProtocol);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#a855f7', '#fbbf24', '#ec4899']
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    onSubmitRequest({
      id: Date.now(),
      materialTitle: formData.requestType,
      requestType: formData.requestType,
      userName: formData.userName,
      whatsapp: formData.whatsapp,
      notes: formData.notes,
      protocol: newProtocol,
      status: 'Pendente ⏳ (Enviado para o Altar)',
      date: new Date().toLocaleDateString('pt-BR')
    });
  };

  const handleCloseModal = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg mystic-card rounded-2xl border-2 border-amber-500/40 shadow-2xl overflow-hidden glow-mystic-strong">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-amber-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl">
              🔮
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mystic">Solicitar Ritual / Velas</h3>
              <p className="text-xs text-purple-200/70">Envie seus dados para consagrar no altar</p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-xl bg-purple-900/80 text-amber-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto glow-gold">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white font-mystic">Ritual Solicitado com Sucesso!</h4>
              <p className="text-xs text-purple-200/80">
                Seu nome e o da pessoa amada já foram registrados no nosso altar.
              </p>
            </div>

            <div className="bg-purple-950/90 p-4 rounded-xl border border-amber-500/30 text-xs text-purple-200 font-mono space-y-1 inline-block text-left w-full">
              <div className="flex justify-between">
                <span>Protocolo de Luz:</span>
                <strong className="text-amber-300">#{protocol}</strong>
              </div>
              <div className="flex justify-between">
                <span>Item Solicitado:</span>
                <span className="text-white truncate max-w-[200px]">{formData.requestType}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-amber-400">Aguardando PIX de R$ 40,00 ⏳</span>
              </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-xs text-amber-200 text-left space-y-1">
              <p className="font-bold">🔑 Chave PIX do Fornecedor de Velas:</p>
              <p className="font-mono text-white text-sm">47996338716</p>
              <p className="text-[11px] text-amber-300/80">Favorecido: Ads Digital • Valor: R$ 40,00</p>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 rounded-xl btn-shimmer-gold text-purple-950 font-extrabold text-xs transition"
            >
              Concluído & Acompanhar Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5 font-mystic">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Item ou Ritual Solicitado
              </label>
              <input
                type="text"
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/90 border border-amber-500/30 text-white text-xs font-medium focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5 font-mystic">
                <User className="w-4 h-4 text-amber-400" />
                Seu Nome Completo
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/90 border border-amber-500/30 text-white text-xs font-medium focus:outline-none focus:border-amber-400 transition"
                placeholder="Ex: Maria Silva"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5 font-mystic">
                <Phone className="w-4 h-4 text-amber-400" />
                WhatsApp (para confirmar início do ritual)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/90 border border-amber-500/30 text-white text-xs font-medium focus:outline-none focus:border-amber-400 transition"
                placeholder="(47) 99999-9999"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5 font-mystic">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Nome da Pessoa Amada & Observações
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950/90 border border-amber-500/30 text-white text-xs font-medium focus:outline-none focus:border-amber-400 transition resize-none"
                placeholder="Nome dele(a), data de nascimento ou pedido especial..."
              />
            </div>

            <div className="bg-purple-950/90 p-3 rounded-xl border border-amber-500/30 text-[11px] text-purple-200/80 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>O trabalho no altar é iniciado logo após a confirmação do Pix dos materiais.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-shimmer-gold text-purple-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="uppercase font-mystic">ENVIAR SOLICITAÇÃO AO ALTAR</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
