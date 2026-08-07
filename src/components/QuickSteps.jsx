import React from 'react';
import { PlayCircle, DownloadCloud, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuickSteps({ onScrollToSidebar }) {
  const steps = [
    {
      step: '01',
      title: 'Assista a VSL Explicativa',
      description: 'Veja o vídeo acima para entender exatamente como usar o produto e solicitar atualizações.',
      icon: PlayCircle,
      badge: 'Passo 1',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      step: '02',
      title: 'Solicite os Materiais na Barra Lateral',
      description: 'Navegue pela barra lateral e clique nos botões para solicitar seus arquivos, copies e artes.',
      icon: DownloadCloud,
      badge: 'Passo 2',
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400'
    },
    {
      step: '03',
      title: 'Receba & Comece a Usar',
      description: 'Tudo pronto! Você receberá os links e arquivos direto no seu WhatsApp ou painel VIP.',
      icon: CheckCircle2,
      badge: 'Passo 3',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    }
  ];

  return (
    <section className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🚀 Como Resolver & Utilizar em 3 Passos
          </h3>
          <p className="text-xs text-slate-400 mt-1">Siga a ordem simples para ter o melhor aproveitamento do seu produto</p>
        </div>

        <button
          onClick={onScrollToSidebar}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-950/40 shrink-0"
        >
          <span>Ir Para a Barra Lateral</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`bg-slate-900/90 rounded-xl p-4 border bg-gradient-to-br ${item.color} space-y-3 relative overflow-hidden group hover:border-slate-600 transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono opacity-40 text-white">
                  {item.step}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/10 uppercase">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
