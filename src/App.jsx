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
import QuizOraculo from './components/QuizOraculo';

const CLOUD_SYNC_URL = 'https://jsonblob.com/api/jsonBlob/019fe372-bd36-7f3c-b70b-b0b84fca9a26';
const RESTFUL_SYNC_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fe379792b1343';
const VERCEL_SYNC_URL = '/api/sync';

// TUDO do quiz (textos + artes) vem por padrão do código, EXCETO a foto da
// personagem (quizHeroUrl) e o logo (quizLogoUrl) que podem ser editados no Admin.
function forcarQuizDoCodigo(cfg) {
  const forcado = { ...cfg };
  Object.keys(CONFIG_PADRAO).forEach((k) => {
    if (k === 'quizHeroUrl' || k === 'quizLogoUrl') {
      if (cfg[k] !== undefined && cfg[k] !== null) return;
    }
    if (k.startsWith('quiz')) forcado[k] = CONFIG_PADRAO[k];
  });
  return forcado;
}

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

function formatarUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (url === '#' || url.includes('SEU-LINK')) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('data:')) {
    url = 'https://' + url;
  }
  return url;
}

function lerParametrosUrl() {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const overrides = {};
    
    const vsl = params.get('vslUrl') || params.get('vsl') || params.get('video');
    if (vsl) overrides.vslUrl = formatarUrl(vsl);

    const hero = params.get('quizHeroUrl') || params.get('hero') || params.get('foto');
    if (hero) overrides.quizHeroUrl = formatarUrl(hero);

    const aspect = params.get('vslAspectRatio') || params.get('aspect');
    if (aspect) overrides.vslAspectRatio = aspect;

    const preco = params.get('preco') || params.get('price');
    if (preco) overrides.planosTotal = preco;

    const checkout = params.get('checkoutUrl') || params.get('checkout');
    if (checkout) overrides.checkoutUrl = formatarUrl(checkout);

    return overrides;
  } catch (e) {
    return {};
  }
}

export default function App() {
  const [config, setConfig] = useState(() => {
    const salvo = lerJson(STORAGE.config, null);
    const urlOverrides = lerParametrosUrl();
    const base = salvo ? { ...CONFIG_PADRAO, ...salvo } : CONFIG_PADRAO;
    return forcarQuizDoCodigo({
      ...base,
      ...urlOverrides,
    });
  });

  const [solicitacoes, setSolicitacoes] = useState(() => lerJson(STORAGE.requests, []));

  const [liberado, setLiberado] = useState(() => {
    try {
      return localStorage.getItem(STORAGE.vslConcluida) === '1';
    } catch {
      return false;
    }
  });

  // Em memória apenas: ao recarregar a página, o lead volta pro quiz.
  // O progresso da leitura (STORAGE.quizEstado) é que faz continuar de onde parou.
  const [quizConcluido, setQuizConcluido] = useState(false);

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

  // 1. SINCRONIZAÇÃO EM NUVEM EM TEMPO REAL (NUNCA FALHA MESMO EM TRAFEGO PAGO)
  useEffect(() => {
    let cancelado = false;

    const aplicarNuvem = (rawPayload) => {
      if (cancelado || !rawPayload || typeof rawPayload !== 'object' || rawPayload.error) return;
      const dataNuvem = rawPayload.data || rawPayload;
      if (!dataNuvem || typeof dataNuvem !== 'object' || dataNuvem.error) return;

      const limpoNuvem = {};
      Object.keys(dataNuvem).forEach((k) => {
        if (dataNuvem[k] !== undefined && dataNuvem[k] !== null && dataNuvem[k] !== '') {
          limpoNuvem[k] = dataNuvem[k];
        }
      });

      if (Object.keys(limpoNuvem).length === 0) return;

      setConfig((antigo) => {
        const urlOverrides = lerParametrosUrl();
        const combinada = forcarQuizDoCodigo({
          ...CONFIG_PADRAO,
          ...antigo,
          ...limpoNuvem,
          ...urlOverrides,
        });
        try {
          localStorage.setItem(STORAGE.config, JSON.stringify(combinada));
        } catch (e) {}
        return combinada;
      });
    };

    // Tenta em paralelo os 3 endpoints de sincronização
    fetch(VERCEL_SYNC_URL).then((res) => res.json()).then(aplicarNuvem).catch(() => {});
    fetch(RESTFUL_SYNC_URL).then((res) => res.json()).then(aplicarNuvem).catch(() => {});
    fetch(CLOUD_SYNC_URL).then((res) => res.json()).then(aplicarNuvem).catch(() => {});

    const handleStorage = (e) => {
      if (e.key === STORAGE.config) {
        const nova = lerJson(STORAGE.config, null);
        if (nova) {
          setConfig((antigo) => ({ ...antigo, ...nova }));
        }
      }
    };
    window.addEventListener('storage', handleStorage);

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
      cancelado = true;
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

  const concluirQuiz = useCallback(() => {
    setQuizConcluido(true);
  }, []);

  const avisarBloqueado = useCallback(() => {
    mostrarToast('Ainda bloqueado', config.avisoBloqueado, 'aviso');
  }, [config.avisoBloqueado, mostrarToast]);

  // Função central de abertura do checkout sincronizado (com auto-formatação de URL)
  const irParaCheckout = useCallback((urlEspecifica) => {
    let destino = formatarUrl(urlEspecifica);
    
    if (!destino) {
      destino = formatarUrl(config.checkoutUrl) || formatarUrl(config.whatsappLink);
    }

    if (destino) {
      window.open(destino, '_blank');
    } else {
      mostrarToast(
        'Checkout não configurado',
        'Insira seu link no Painel Admin clicando em Editar Página.',
        'aviso'
      );
    }
  }, [config.checkoutUrl, config.whatsappLink, mostrarToast]);

  function selecionarMaterial(material) {
    const customUrl = formatarUrl(material?.url);
    if (customUrl) {
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
    const configFormatada = {
      ...CONFIG_PADRAO,
      ...config,
      ...novaConfig,
      checkoutUrl: formatarUrl(novaConfig.checkoutUrl || config.checkoutUrl),
      quizHeroUrl: formatarUrl(novaConfig.quizHeroUrl !== undefined ? novaConfig.quizHeroUrl : config.quizHeroUrl),
      quizLogoUrl: formatarUrl(novaConfig.quizLogoUrl !== undefined ? novaConfig.quizLogoUrl : config.quizLogoUrl),
    };

    // 1. Atualiza o estado local
    setConfig(configFormatada);

    // 2. Salva no localStorage
    try {
      localStorage.setItem(STORAGE.config, JSON.stringify(configFormatada));
    } catch (e) {}

    // 3. Salva no Servidor Vercel Dedicated API + Nuvem de backup RESTful + JSONBlob
    fetch(VERCEL_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configFormatada),
    }).catch(() => {});

    fetch(RESTFUL_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'safira_config', data: configFormatada }),
    }).catch(() => {});

    fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configFormatada),
    }).catch(() => {});

    // 4. Notifica outras abas em tempo real
    try {
      const bc = new BroadcastChannel('safira_config_channel');
      bc.postMessage({ type: 'CONFIG_UPDATED', config: configFormatada });
      bc.close();
    } catch (e) {}

    mostrarToast('Configurações Salvas! ⚡', 'Suas alterações foram gravadas e ativadas com sucesso.');
  };

  // Funil do quiz roda ANTES da área de membros.
  // Ignorado no modo admin (pra editar) e se o quiz estiver desativado.
  const mostrarQuiz = config.quizAtivo && !quizConcluido && !isAdmin;
  if (mostrarQuiz) {
    return <QuizOraculo config={config} onConcluir={concluirQuiz} />;
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#120a0b] text-[#ffffff] md:flex-row font-sans selection:bg-amber-500 selection:text-slate-950">

      {/* Aurora ambiente (o vidro refrata) */}
      <div className="app-aurora" aria-hidden>
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>

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
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-10">

        {secao === 'inicio' && (
          <div className="animate-fadeIn flex flex-1 flex-col justify-center pb-10">
            <div className="lg space-y-4 p-4 md:p-6">
              <VSLPlayer config={config} liberado={liberado} onConcluir={concluirVsl} />

              <h1 className="mt-2 text-xl font-bold font-mystic text-amber-300 md:text-2xl">
                {config.vslTitle}
              </h1>

              <div className="mt-2 space-y-2 text-sm text-[#efe3df]/90 md:text-base">
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
        <footer className="mt-10 flex items-center justify-between gap-3 border-t border-amber-500/20 pt-4 text-[11px] text-[#d8c3bd]/50">
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
