import React, { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

import { CONFIG_PADRAO, STORAGE } from './config';
import Sidebar from './components/Sidebar';
import MobileTopbar from './components/MobileTopbar';
import VSLPlayer from './components/VSLPlayer';
import MateriaisSection from './components/MateriaisSection';
import BonusSection from './components/BonusSection';
import PlanosSection from './components/PlanosSection';
import MaterialRequestModal from './components/MaterialRequestModal';
import AdminConfigModal from './components/AdminConfigModal';
import Toast from './components/Toast';
import SocialProofToast from './components/SocialProofToast';

const TITULOS = {
  inicio: 'Início',
  materiais: 'Materiais',
  bonus: 'Bônus',
  planos: 'Planos',
};

function lerJson(chave, fallback) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [config, setConfig] = useState(() => {
    const salvo = lerJson(STORAGE.config, null);
    if (!salvo) return CONFIG_PADRAO;
    return {
      ...CONFIG_PADRAO,
      ...salvo,
    };
  });

  const [solicitacoes, setSolicitacoes] = useState(() => lerJson(STORAGE.requests, []));

  const [liberado, setLiberado] = useState(() => {
    try {
      return localStorage.getItem(STORAGE.vslConcluida) === '1';
    } catch {
      return false;
    }
  });

  const [secao, setSecao] = useState('inicio');
  const [menuAberto, setMenuAberto] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalSolicitacao, setModalSolicitacao] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState(null);
  const [modalAdmin, setModalAdmin] = useState(false);

  // Modo Admin (?admin, ?admin=true, #admin ou /admin na URL)
  const isAdmin = typeof window !== 'undefined' && (
    window.location.search.includes('admin') || 
    window.location.hash.includes('admin') ||
    window.location.pathname.includes('admin')
  );

  // 1. SINCRONIZAÇÃO EM TEMPO REAL ENTRE ABAS E JANELAS DIVERENTES (BroadCast & LocalStorage Event)
  useEffect(() => {
    const carregarConfigAtualizada = () => {
      const nova = lerJson(STORAGE.config, null);
      if (nova) {
        setConfig((antigo) => ({
          ...CONFIG_PADRAO,
          ...antigo,
          ...nova,
        }));
      }
    };

    // Evento nativo de alteração do localStorage entre abas
    const handleStorage = (e) => {
      if (e.key === STORAGE.config) {
        carregarConfigAtualizada();
      }
    };
    window.addEventListener('storage', handleStorage);

    // BroadcastChannel para sincronizar sem reload
    let bc;
    try {
      bc = new BroadcastChannel('safira_config_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'CONFIG_UPDATED') {
          setConfig(event.data.config);
        }
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  // 2. Injeção Dinâmica do Meta Pixel (Facebook PageView)
  useEffect(() => {
    const pixelId = (config.pixelId || '').trim();
    if (!pixelId) return;

    if (window.fbq) {
      try { window.fbq('track', 'PageView'); } catch(e) {}
      return;
    }

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    try {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    } catch (e) {}
  }, [config.pixelId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE.config, JSON.stringify(config));
    } catch (e) {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE.requests, JSON.stringify(solicitacoes));
    } catch (e) {}
  }, [solicitacoes]);

  const mostrarToast = useCallback((titulo, mensagem, tom = 'ok') => {
    setToast({ titulo, mensagem, tom });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const concluirVsl = useCallback(() => {
    setLiberado((jaEstava) => {
      if (jaEstava) return true;
      try {
        localStorage.setItem(STORAGE.vslConcluida, '1');
      } catch (e) {}
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
      mostrarToast(
        'Vídeo concluído! 🎉',
        'Agora os materiais foram liberados no menu ao lado.'
      );
      return true;
    });
  }, [mostrarToast]);

  const avisarBloqueado = useCallback(() => {
    mostrarToast('Ainda bloqueado', config.avisoBloqueado, 'aviso');
  }, [config.avisoBloqueado, mostrarToast]);

  // Função central de abertura do checkout sincronizado
  const irParaCheckout = useCallback((urlEspecifica) => {
    let destino = urlEspecifica;
    
    // Se a URL do item for inválida/placeholder, força o checkoutUrl configurado no Admin!
    if (!destino || destino.includes('SEU-LINK') || destino === '#') {
      destino = config.checkoutUrl || config.whatsappLink;
    }

    if (destino && destino.startsWith('http') && !destino.includes('SEU-LINK')) {
      window.open(destino, '_blank');
    } else if (config.checkoutUrl && config.checkoutUrl.startsWith('http') && !config.checkoutUrl.includes('SEU-LINK')) {
      window.open(config.checkoutUrl, '_blank');
    } else {
      mostrarToast(
        'Checkout não configurado',
        'Defina seu link de checkout no Painel Admin.',
        'aviso'
      );
    }
  }, [config.checkoutUrl, config.whatsappLink, mostrarToast]);

  function selecionarMaterial(material) {
    const customUrl = material?.url;
    if (customUrl && customUrl.startsWith('http') && !customUrl.includes('SEU-LINK')) {
      irParaCheckout(customUrl);
    } else {
      irParaCheckout(config.checkoutUrl);
    }
  }

  function abrirSolicitacaoAvulsa() {
    irParaCheckout(config.checkoutUrl);
  }

  function registrarSolicitacao(nova) {
    setSolicitacoes((antes) => [nova, ...antes]);
    mostrarToast(
      'Solicitação enviada!',
      `"${nova.materialTitle}" registrada com o protocolo #${nova.protocol}.`
    );
  }

  const salvarEAtualizarConfig = (novaConfig) => {
    // 1. Atualiza o estado da aba atual
    setConfig(novaConfig);

    // 2. Persiste no localStorage
    try {
      localStorage.setItem(STORAGE.config, JSON.stringify(novaConfig));
    } catch (e) {}

    // 3. Notifica outras abas abertas em tempo real via BroadcastChannel
    try {
      const bc = new BroadcastChannel('safira_config_channel');
      bc.postMessage({ type: 'CONFIG_UPDATED', config: novaConfig });
      bc.close();
    } catch (e) {}

    mostrarToast('Página Sincronizada! ⚡', 'As alterações já estão ativas em todas as abas.');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#07040d] text-white md:flex-row font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Topbar para Celular */}
      <MobileTopbar
        config={config}
        tituloSecao={TITULOS[secao]}
        onAbrirMenu={() => setMenuAberto(true)}
        onAbrirAdmin={() => setModalAdmin(true)}
        isAdmin={isAdmin}
      />

      {/* Fundo escurecido no mobile */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Barra Lateral de Navegação (Menu com Trava da VSL) */}
      <Sidebar
        config={config}
        secaoAtiva={secao}
        onTrocarSecao={setSecao}
        liberado={liberado}
        onClicarBloqueado={avisarBloqueado}
        onSolicitarMateriais={() => irParaCheckout()}
        aberta={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      {/* Área Principal de Conteúdo */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-10">
        
        {secao === 'inicio' && (
          <div className="animate-fadeIn flex flex-1 flex-col justify-center pb-10 space-y-4">
            <VSLPlayer config={config} liberado={liberado} onConcluir={concluirVsl} />

            <h1 className="mt-2 text-xl font-bold font-mystic text-amber-300 md:text-2xl">
              {config.vslTitle}
            </h1>

            <div className="mt-2 space-y-2 text-sm text-purple-200/90 md:text-base">
              {(config.vslLinhas || []).map((linha, i) => (
                <p key={i}>
                  {linha.forte && (
                    <span className="font-bold text-amber-300">{linha.forte} </span>
                  )}
                  {linha.texto}
                </p>
              ))}
            </div>
          </div>
        )}

        {secao === 'materiais' && (
          <MateriaisSection
            config={config}
            solicitacoes={solicitacoes}
            onSelecionarMaterial={selecionarMaterial}
            onAbrirSolicitacao={abrirSolicitacaoAvulsa}
          />
        )}

        {secao === 'bonus' && <BonusSection config={config} onDesbloquear={() => irParaCheckout()} />}

        {secao === 'planos' && <PlanosSection config={config} onComprar={() => irParaCheckout()} />}

        {/* Rodapé da Página */}
        <footer className="mt-10 flex items-center justify-between gap-3 border-t border-amber-500/20 pt-4 text-[11px] text-purple-300/50">
          <span>
            © {new Date().getFullYear()} {config.productName}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setModalAdmin(true)}
              className="transition-colors hover:text-amber-300 font-semibold text-amber-400"
            >
              Painel Admin ⚙️
            </button>
          )}
        </footer>
      </main>

      {/* Pop-up de Prova Social ao Vivo (Escassez) */}
      <SocialProofToast />

      {/* Modais de Solicitação e Painel Admin */}
      <MaterialRequestModal
        isOpen={modalSolicitacao}
        onClose={() => setModalSolicitacao(false)}
        selectedMaterial={materialSelecionado}
        onSubmitRequest={registrarSolicitacao}
      />

      <AdminConfigModal
        isOpen={modalAdmin}
        onClose={() => setModalAdmin(false)}
        config={config}
        onSaveConfig={salvarEAtualizarConfig}
        onResetDefaults={() => {
          setConfig(CONFIG_PADRAO);
          try {
            localStorage.removeItem(STORAGE.config);
          } catch (e) {}
          mostrarToast('Padrões restaurados', 'A configuração original voltou.');
        }}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
