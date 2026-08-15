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
import QuizOraculoNovo from './components/QuizOraculoNovo';
import QuizNumerologico from './components/QuizNumerologico';
import QuizXamanico from './components/QuizXamanico';

const CLOUD_SYNC_URL = 'https://jsonblob.com/api/jsonBlob/019fe391-9be1-7dba-827b-901a3c5a1d0d';
const RESTFUL_SYNC_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fe379792b1343';
const VERCEL_SYNC_URL = '/api/sync';
const CHECKOUT_ANTIGO = 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl';
const CHECKOUT_NOVO = 'https://ggcheckout.app/checkout/v5/K5qJrW0VINjwRkiJydnl';

// Preserva campos editáveis pelo usuário no quiz e configurações da VSL
function forcarQuizDoCodigo(cfg) {
  const forcado = { ...CONFIG_PADRAO, ...(cfg || {}) };

  const camposPreservados = [
    'quizHeroUrl',
    'quizLogoUrl',
    'quizVsl1Url',
    'quizVsl2Url',
    'quizVsl1Delay',
    'quizVsl2Delay',
    'quizVsl2CtaTexto',
    'quizVsl2CtaUrl',
    'quizVslAspectRatio',
    'quizBotaoRevelacaoTexto',
    'backRedirectUrl',
    'checkoutUrl',
    'whatsappLink',
    'pixelId',
    'productName',
    'subTitle',
    'vslUrl',
    'vslCtaSegundo',
    'vslCtaTexto',
    'vslCtaUrl',
    'planosTotal',
    'variacoes',
    'updatedAt'
  ];

  camposPreservados.forEach((k) => {
    if (cfg && cfg[k] !== undefined && cfg[k] !== null && cfg[k] !== '') {
      forcado[k] = cfg[k];
    }
  });

  // Limpa qualquer checkout antigo de concorrente (payt, etc.)
  const isConcorrente = (url) => !url || String(url).includes('payt.com.br') || String(url).includes('aff65c96dae733bb4c5b8b906fb7b440') || (String(url).includes('ggcheckout') && !String(url).includes('K5qJrW0VINjwRkiJydnl'));
  if (isConcorrente(forcado.checkoutUrl)) forcado.checkoutUrl = CONFIG_PADRAO.checkoutUrl;
  if (isConcorrente(forcado.whatsappLink)) forcado.whatsappLink = CONFIG_PADRAO.whatsappLink;
  if (isConcorrente(forcado.vslCtaUrl)) forcado.vslCtaUrl = CONFIG_PADRAO.vslCtaUrl;
  if (isConcorrente(forcado.quizVsl2CtaUrl)) forcado.quizVsl2CtaUrl = CONFIG_PADRAO.quizVsl2CtaUrl;
  if (isConcorrente(forcado.backRedirectUrl)) forcado.backRedirectUrl = CONFIG_PADRAO.backRedirectUrl;

  // Garante a imagem original do quiz sem resquício de cache
  if (!forcado.quizHeroUrl || forcado.quizHeroUrl.includes('oraculo-3d')) {
    forcado.quizHeroUrl = CONFIG_PADRAO.quizHeroUrl;
  }

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

  // Se o usuário colou uma tag <iframe ... src="...">, extrai automaticamente a URL direta limpa!
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      url = match[1].trim();
    }
  }

  // Limpa corrupções prévias como "https://<iframe..."
  if (url.startsWith('https://<') || url.startsWith('http://<')) {
    url = url.replace(/^https?:\/\//i, '');
  }

  // Se o usuário colou qualquer outra tag HTML embed (<script, <div, etc.), retorne o código embed puro
  if (url.startsWith('<') || url.includes('<iframe') || url.includes('<script')) {
    return url;
  }

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
    
    // Suporte a slug ou número de variação (?v=1, ?v=2, ?v=3, ?variacao=v2, ?c=3)
    const varParam = params.get('v') || params.get('variacao') || params.get('c');
    if (varParam) overrides.variationParam = varParam;

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

function aplicarVariacaoDaUrl(cfg, urlOverrides) {
  if (!cfg) return cfg;
  const varParam = urlOverrides?.variationParam;
  if (!varParam) return cfg;

  const variacoes = cfg.variacoes || CONFIG_PADRAO.variacoes || [];
  const varEncontrada = variacoes.find(
    (v) =>
      String(v.slug) === String(varParam) ||
      String(v.id) === String(varParam) ||
      String(v.id) === `v${varParam}`
  );

  if (varEncontrada) {
    const checkout = formatarUrl(varEncontrada.checkoutUrl || cfg.checkoutUrl);
    const vsl = formatarUrl(varEncontrada.vslUrl || cfg.vslUrl);
    const preco = varEncontrada.planosTotal || cfg.planosTotal;

    const materiaisAtualizados = (cfg.materials || CONFIG_PADRAO.materials || []).map((m) => ({
      ...m,
      url: checkout || m.url,
    }));

    const novosPlanos = (cfg.planos || CONFIG_PADRAO.planos || []).map((plano, i) => {
      if (i === 0) return { ...plano, valor: preco };
      return plano;
    });

    return {
      ...cfg,
      vslUrl: vsl,
      checkoutUrl: checkout,
      whatsappLink: checkout,
      vslAspectRatio: varEncontrada.vslAspectRatio || cfg.vslAspectRatio,
      vslCtaSegundo: varEncontrada.vslCtaSegundo ?? cfg.vslCtaSegundo,
      vslCtaTexto: varEncontrada.vslCtaTexto || cfg.vslCtaTexto,
      vslCtaUrl: varEncontrada.vslCtaUrl || checkout || cfg.vslCtaUrl,
      planosTotal: preco,
      planosAVista: preco,
      planos: novosPlanos,
      materials: materiaisAtualizados,
    };
  }

  return cfg;
}

function App() {
  const [baseConfig, setBaseConfig] = useState(() => {
    const salvo = lerJson(STORAGE.config, null);
    const base = salvo ? { ...CONFIG_PADRAO, ...salvo } : CONFIG_PADRAO;
    // Placeholder antigo de teste nunca deve sobrescrever o vídeo oficial
    if (!base.vslUrl || base.vslUrl.includes('test-vsl-link')) {
      base.vslUrl = CONFIG_PADRAO.vslUrl;
      base.vslDuracaoSegundos = CONFIG_PADRAO.vslDuracaoSegundos;
      base.vslAspectRatio = CONFIG_PADRAO.vslAspectRatio;
    }
    if (base.vslUrl) base.vslUrl = formatarUrl(base.vslUrl);
    return forcarQuizDoCodigo(base);
  });

  const urlOverrides = lerParametrosUrl();
  const variationId = urlOverrides.variationParam || 'v1';
  const vslConcluidaKey = `${STORAGE.vslConcluida}_${variationId}`;
  const quizConcluidaKey = `${STORAGE.quizConcluido}_${variationId}`;

  // Configuração final com a variação da URL aplicada (em memória para renderização)
  const config = aplicarVariacaoDaUrl(baseConfig, urlOverrides);

  const [solicitacoes, setSolicitacoes] = useState(() => lerJson(STORAGE.requests, []));

  const [liberado, setLiberado] = useState(() => {
    try {
      return localStorage.getItem(vslConcluidaKey) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      setLiberado(localStorage.getItem(vslConcluidaKey) === '1');
    } catch {
      setLiberado(false);
    }
  }, [vslConcluidaKey]);

  // O funil do quiz reinicia deliberadamente a cada atualização de página.
  // Isso evita restaurar uma etapa intermediária com interface travada.
  const [quizConcluido, setQuizConcluido] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem(quizConcluidaKey);
    } catch (e) {}
  }, [quizConcluidaKey]);

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

  // Script de Back-Redirect (leva para o link de checkout ou oferta ao tentar sair)
  useEffect(() => {
    if (!config.backRedirectUrl) return;
    const url = config.backRedirectUrl.trim();
    if (!url || url.includes('SEU-LINK')) return;

    let urlBackRedirect = url + (url.indexOf('?') > 0 ? '&' : '?') + window.location.search.replace('?', '');

    try {
      window.history.pushState({}, '', window.location.href);
      window.history.pushState({}, '', window.location.href);

      const handlePopstate = () => {
        setTimeout(() => {
          window.location.href = urlBackRedirect;
        }, 1);
      };

      window.addEventListener('popstate', handlePopstate);
      return () => window.removeEventListener('popstate', handlePopstate);
    } catch (e) {}
  }, [config.backRedirectUrl]);

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

      if (limpoNuvem.vslUrl) {
        limpoNuvem.vslUrl = formatarUrl(limpoNuvem.vslUrl);
      }

      setBaseConfig((antigo) => {
        const vslLocal = antigo.vslUrl;
        const aspectLocal = antigo.vslAspectRatio;
        const variacoesLocal = antigo.variacoes;

        const vslNuvem = limpoNuvem.vslUrl;
        const aspectNuvem = limpoNuvem.vslAspectRatio;
        const variacoesNuvem = limpoNuvem.variacoes;

        const timestampNuvem = limpoNuvem.updatedAt || 0;
        const timestampAntigo = antigo.updatedAt || 0;

        // Se tínhamos VSL, Aspect ou Variações salvas localmente e a nuvem veio sem ele ou é mais antiga, preserva o local!
        if (vslLocal && (!vslNuvem || (timestampAntigo > 0 && timestampNuvem < timestampAntigo))) {
          limpoNuvem.vslUrl = vslLocal;
        }

        if (aspectLocal && (!aspectNuvem || (timestampAntigo > 0 && timestampNuvem < timestampAntigo))) {
          limpoNuvem.vslAspectRatio = aspectLocal;
        }

        if (variacoesLocal && (!variacoesNuvem || (timestampAntigo > 0 && timestampNuvem < timestampAntigo))) {
          limpoNuvem.variacoes = variacoesLocal;
        }

        const combinada = forcarQuizDoCodigo({
          ...CONFIG_PADRAO,
          ...antigo,
          ...limpoNuvem,
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
          setBaseConfig((antigo) => ({ ...antigo, ...nova }));
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    let bc;
    try {
      bc = new BroadcastChannel('safira_config_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'CONFIG_UPDATED') {
          setBaseConfig(event.data.config);
        }
      };
    } catch (e) {}

    return () => {
      cancelado = true;
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE.config, JSON.stringify(baseConfig));
    } catch (e) {}
  }, [baseConfig]);

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
        localStorage.setItem(vslConcluidaKey, '1');
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
  }, [vslConcluidaKey, mostrarToast]);

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
    const agora = Date.now();

    // Formata e isola cada variação individualmente
    const variacoesTratadas = (novaConfig.variacoes || config.variacoes || []).map((v) => ({
      ...v,
      vslUrl: formatarUrl(v.vslUrl),
      checkoutUrl: formatarUrl(v.checkoutUrl),
    }));

    // A variação 0 (VSL 1) é a fonte oficial para o site principal (sem ?v=)
    const v1 = variacoesTratadas[0];

    const configFormatada = {
      ...CONFIG_PADRAO,
      ...config,
      ...novaConfig,
      variacoes: variacoesTratadas,
      vslUrl: v1?.vslUrl ? formatarUrl(v1.vslUrl) : formatarUrl(novaConfig.vslUrl || config.vslUrl),
      checkoutUrl: v1?.checkoutUrl ? formatarUrl(v1.checkoutUrl) : formatarUrl(novaConfig.checkoutUrl || config.checkoutUrl),
      vslAspectRatio: v1?.vslAspectRatio || novaConfig.vslAspectRatio || config.vslAspectRatio || '4:5',
      planosTotal: v1?.planosTotal || novaConfig.planosTotal || config.planosTotal || 'R$ 40,00',
      quizHeroUrl: formatarUrl(novaConfig.quizHeroUrl !== undefined ? novaConfig.quizHeroUrl : config.quizHeroUrl),
      quizLogoUrl: formatarUrl(novaConfig.quizLogoUrl !== undefined ? novaConfig.quizLogoUrl : config.quizLogoUrl),
      updatedAt: agora,
    };

    // 1. Atualiza a configuração-base que alimenta todo o app.
    // `config` é derivada das variações da URL e não possui setter.
    setBaseConfig(configFormatada);

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
  const usarQuizNovo = typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/oraculo';
  
  const isRotaXamanico = typeof window !== 'undefined' && (
    window.location.pathname.includes('xamanico') ||
    window.location.pathname.includes('teste-xamanico') ||
    window.location.search.includes('xamanico') ||
    window.location.search.includes('quiz=xamanico') ||
    window.location.search.includes('modelo=xamanico') ||
    window.location.hash.includes('xamanico')
  );

  const isRotaNumerologia = typeof window !== 'undefined' && (
    window.location.pathname.includes('numerologia') ||
    window.location.pathname.includes('teste-numerologico') ||
    window.location.search.includes('numerologia') ||
    window.location.search.includes('quiz=numerologia') ||
    window.location.search.includes('modelo=numerologia') ||
    window.location.hash.includes('numerologia')
  );

  // Após concluir o quiz, a VSL exclusiva dele pode ser exibida sem alterar a
  // VSL padrão da página para acessos que não passaram pela consulta.
  const configDaVslDoQuiz = quizConcluido && config.quizVslUrl
    ? { ...config, vslUrl: config.quizVslUrl }
    : config;

  if (mostrarQuiz) {
    if (isRotaXamanico) {
      return <QuizXamanico config={config} variationId={variationId} onConcluir={concluirQuiz} />;
    }
    if (isRotaNumerologia) {
      return <QuizNumerologico config={config} variationId={variationId} onConcluir={concluirQuiz} />;
    }
    if (usarQuizNovo) {
      return <QuizOraculoNovo config={config} variationId={variationId} onConcluir={concluirQuiz} />;
    }
    return <QuizOraculo config={config} variationId={variationId} onConcluir={concluirQuiz} />;
  }

  return (
    <div className="member-area relative flex min-h-[100dvh] flex-col text-[#ffffff] md:flex-row font-sans">

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
      <main className="relative z-10 mx-auto flex min-w-0 w-full max-w-3xl max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-10">

        {secao === 'inicio' && (
          <div className="animate-fadeIn flex flex-1 flex-col justify-center pb-10">
            <div className="vsl-experience lg space-y-4 p-4 md:p-6">
              <VSLPlayer config={configDaVslDoQuiz} liberado={liberado} onConcluir={concluirVsl} />

              <h1 className="vsl-title mt-2 text-xl font-bold md:text-2xl">
                {config.vslTitle}
              </h1>

              <div className="vsl-copy mt-2 space-y-2 text-sm md:text-base">
                {(config.vslLinhas || []).map((linha, i) => (
                  <p key={i}>
                    {linha.forte && (
                      <span className="font-bold">{linha.forte} </span>
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

export default App;
