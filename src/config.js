// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO SAFIRA ORÁCULO — MODELO QUIZ XQUIZ 2026
// ─────────────────────────────────────────────────────────────

export const CONFIG_PADRAO = {
  // ─── Marca ───────────────────────────────────────────────
  productName: 'Safira Oráculo',
  subTitle: 'Especialista em Destravamento de Caminhos e Relacionamento',
  logoUrl: '',

  // ─── Rastreamento (Pixel) ────────────────────────────────
  pixelId: '1374470023595160', // Meta Pixel Facebook registrado pelo usuário

  // ─── Links de conversão ──────────────────────────────────
  checkoutUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
  whatsappLink: 'https://lastlink.com/p/C03402B87/checkout-payment/',
  backRedirectUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',

  // ─── Barra lateral (Área de membros pós-quiz) ───────────
  dicaSidebar: 'Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais',
  ctaSidebar: 'Solicitar Materiais',

  // ─── VSL Principal (Área de Membros) ────────────────────
  vslUrl: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
  vslDuracaoSegundos: 1080,
  vslAspectRatio: '4:5', // '16:9', '4:5' ou '9:16'
  vslCtaSegundo: 1027, // 17 minutos e 07 segundos (17 * 60 + 7 = 1027s)
  vslCtaTexto: 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA',
  vslCtaUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',

  // ─── QUIZ DE ENTRADA MODELADO (xquiz.io) ────────────────
  quizAtivo: true,

  // Página 1 — Introdução do Quiz
  quizLogoUrl: '',
  quizHeroUrl: 'https://cdn.xquiz.co/images/7302e5ee-a1ba-40b5-b6eb-a7827f03198f',
  quizIntroTitulo: 'Descubra Agora o Que as Cartas Revelam Sobre a Sua Vida Neste Ano De 2026!',
  quizIntroSubtitulo: 'As cartas podem revelar o caminho exato para destravar os caminhos travados em sua vida.',
  quizIntroCta: 'FAZER LEITURA GRATUITA',

  // Páginas 2 a 6 — Perguntas Interativas
  quizPerguntas: [
    {
      id: 1,
      titulo: 'Qual dessas frases mais descreve o que você está sentindo esse ano?',
      opcoes: [
        { texto: '💔 Me sinto travada e parece que nada anda, por mais que eu tente' },
        { texto: '💜 Tenho tudo pra ser feliz, mas ainda sinto um vazio por dentro' },
        { texto: '💛 Estou numa decisão importante e não sei qual caminho seguir' },
        { texto: '🔵 Sinto que algo grande está prestes a mudar, mas não sei o quê' },
      ],
    },
    {
      id: 2,
      titulo: 'Qual dessas frases mais representa seus sentimentos e desafios?',
      opcoes: [
        { texto: '💔 Me doo completamente pelas pessoas, mas quando preciso... estou sozinha' },
        { texto: '😔 Sinto que carrego tudo nas costas enquanto os outros seguem em frente' },
        { texto: '🥀 Já dei tanto de mim que nem sei mais o que sobrou pra mim mesma' },
        { texto: '🌀 Sinto que meu amor, meu esforço e minha energia nunca são suficientes para ninguém' },
      ],
    },
    {
      id: 3,
      titulo: 'O que você espera de mudança este ano para sua vida?',
      opcoes: [
        { texto: '💰 Melhorar minha situação financeira' },
        { texto: '❤️ Encontrar o meu grande amor' },
        { texto: '🌿 Encontrar a minha paz interior' },
        { texto: '✨ Encontrar a minha direção e propósito de vida' },
      ],
    },
    {
      id: 4,
      titulo: 'Você já teve a sensação de olhar ao redor e ver todo mundo avançando... Mas sentir que você ainda está travada no mesmo lugar?',
      opcoes: [
        { texto: '✅ Sim, me identifico completamente' },
        { texto: '🔄 Às vezes... mas acho que é só fase' },
        { texto: '🤔 Tenho esse sentimento, mas não sei explicar de onde vem' },
      ],
    },
    {
      id: 5,
      kicker: '(Última pergunta antes da sua leitura)',
      subtexto: 'Se as cartas revelassem HOJE o que está bloqueando sua vida e te mostrassem o caminho exato para desbloquear...',
      titulo: 'Você estaria pronto para seguir essa orientação?',
      opcoes: [
        { texto: '✅ Sim, estou pronta para receber' },
        { texto: '⚠️ Sim, mas tenho medo de me decepcionar de novo' },
        { texto: '🤔 Não sei, depende do que as cartas disserem' },
      ],
    },
  ],

  // Página 7 — Diagnóstico e Transição
  quizTransicaoCarregando: 'Analisando suas respostas...',
  quizTransicaoLinhas: [
    'A partir do que você me revelou... O universo irá filtrar, entre milhares de combinações possíveis...',
    'As únicas 8 cartas capazes de falar diretamente com a sua energia neste momento.',
    'Escolha apenas 3 para descobrir o caminho exato para destravar tudo em 2026.',
    'Prepare-se.',
  ],
  quizTransicaoCta: 'Escolher Minhas Cartas Agora',

  // Página 8 — Escolha das 8 Cartas (Grid 4x2)
  quizCartasTitulo: 'O baralho está aberto para você:',
  quizCartasSubtitulo: 'Não pense muito, apenas sinta.',
  quizCartasInstrucao: 'Escolha 3 cartas, uma de cada vez, na ordem que o seu instinto mandar:',
  quizCartasQtd: 3,
  quizSomAtivo: true,
  quizAudioUrl: 'https://media.base44.com/files/public/user_6a345b7a1d1c8dfb9baf54b0/421f6cbfb_universfield-swoosh-06-351021.mp3',

  // 8 Versos das Cartas (PNGs de alta resolução com fallback SVG)
  quizCartas: [
    { id: 1, nome: 'Carta 1', verso: 'https://i.ibb.co/99SSktdp/1.png', alt: 'Carta 1' },
    { id: 2, nome: 'Carta 2', verso: 'https://i.ibb.co/R4cBgSbP/2.png', alt: 'Carta 2' },
    { id: 3, nome: 'Carta 3', verso: 'https://i.ibb.co/VWvKcw8L/3.png', alt: 'Carta 3' },
    { id: 4, nome: 'Carta 4', verso: 'https://i.ibb.co/CK0Z8PVy/4.png', alt: 'Carta 4' },
    { id: 5, nome: 'Carta 5', verso: 'https://i.ibb.co/GvpYzq9T/5.png', alt: 'Carta 5' },
    { id: 6, nome: 'Carta 6', verso: 'https://i.ibb.co/2DR4Ngx/6.png', alt: 'Carta 6' },
    { id: 7, nome: 'Carta 7', verso: 'https://i.ibb.co/vxyPVqS2/7.png', alt: 'Carta 7' },
    { id: 8, nome: 'Carta 8', verso: 'https://i.ibb.co/ccbyWrbp/8.png', alt: 'Carta 8' },
  ],

  // 3 Cartas Reveladas Fixas (1ª, 2ª e 3ª escolha)
  quizCartasReveladas: [
    { nome: 'A Roda da Fortuna', src: 'https://i.ibb.co/ZppN9M58/A-RODA-DA-FORTUNA.png', alt: 'A Roda da Fortuna' },
    { nome: 'O Louco', src: 'https://i.ibb.co/4ZtyD9Xx/O-LOUCO.png', alt: 'O Louco' },
    { nome: 'A Torre', src: 'https://i.ibb.co/v6gCFykW/A-TORRE.png', alt: 'A Torre' },
  ],
  quizBotaoRevelacaoTexto: 'VER RESULTADO DA LEITURA',

  // Página 9 — VSL 1 (Vídeo de Leitura + Escolha da Carta Sagrada do Altar)
  quizVsl1Url: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
  quizVsl1Delay: 460, // Segundos para liberar a carta sagrada e o botão de avançar (0 = imediato)
  quizVsl1Titulo: 'Escolha a sua carta:',
  quizVsl1Subtitulo: '(E depois toque em "Continuar")',
  quizVsl1CtaTexto: 'Continuar',
  quizVsl1CartasSagradas: [
    { id: 1, nome: 'O Louco', frente: 'https://artesetaro.com.br/wp-content/uploads/2020/12/Carta-de-Taro-O-Louco-597x1024.jpg' },
    { id: 2, nome: 'A Torre', frente: 'https://i0.wp.com/oficinadasbruxas.com/wp-content/uploads/2014/10/16.jpg' },
    { id: 3, nome: 'O Hierofante', frente: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RWS_Tarot_05_Hierophant.jpg/250px-RWS_Tarot_05_Hierophant.jpg' },
    { id: 4, nome: 'A Estrela', frente: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Jean_Dodal_Tarot_trump_17.jpg' },
    { id: 5, nome: 'A Roda da Fortuna', frente: 'https://i.ibb.co/ZppN9M58/A-RODA-DA-FORTUNA.png' },
  ],

  // Página 10 — VSL 2 (Vídeo 2 + Botão de Ativação do Código / Oferta)
  quizVsl2Url: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
  quizVsl2Delay: 1027, // 17 minutos e 07 segundos (1027s) para liberar o botão CTA
  quizVsl2CtaTexto: 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA',
  quizVsl2CtaUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
  quizVslAspectRatio: '4:5',

  // ─── Gerenciador de Variações VSL (A/B Test Multi-Checkout) ─
  variacoes: [
    {
      id: 'v1',
      slug: '1',
      nome: 'VSL 1 — Principal (Rodando)',
      vslUrl: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
      checkoutUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
      vslAspectRatio: '4:5',
      planosTotal: 'R$ 40,00',
      vslCtaSegundo: 1027,
      vslCtaTexto: 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA',
      vslCtaUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
    {
      id: 'v2',
      slug: '2',
      nome: 'VSL 2 — Teste B',
      vslUrl: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
      checkoutUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
      vslAspectRatio: '4:5',
      planosTotal: 'R$ 40,00',
      vslCtaSegundo: 1027,
      vslCtaTexto: 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA',
      vslCtaUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
    {
      id: 'v3',
      slug: '3',
      nome: 'VSL 3 — Teste C',
      vslUrl: 'https://play.tynk.ai/p/8874ec41-1d42-4772-b5e0-6b34a6f9d3b0',
      checkoutUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
      vslAspectRatio: '4:5',
      planosTotal: 'R$ 60,00',
      vslCtaSegundo: 1027,
      vslCtaTexto: 'QUERO ATIVAR ABUNDÂNCIA NA MINHA VIDA',
      vslCtaUrl: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
  ],

  vslTitle: '⚠️ AS CARTAS PEDIRAM UM TRABALHO URGENTE — ASSISTA ATÉ O FINAL PARA LIBERAR OS MATERIAIS',
  vslLinhas: [
    { texto: 'Sua leitura já mostrou o bloqueio. Agora veja o que precisa ser feito ainda hoje:' },
    { forte: 'Passo 1:', texto: 'Assista o vídeo até o final — é o caminho do seu trabalho.' },
    { forte: 'Passo 2:', texto: 'Entenda os materiais do altar (mão de obra grátis).' },
    { forte: 'Passo 3:', texto: 'Solicite os materiais na barra ao lado e eu começo ainda hoje.' },
  ],

  avisoBloqueado: '🔒 Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais',

  // ─── Materiais & Oferendas do Altar ─────────────────────
  materiaisTitulo: 'Materiais & Oferendas do Altar',
  materiaisSubtitulo: 'Não cobro pela mão de obra. O valor refere-se apenas aos materiais do santuário. Liberação imediata após a solicitação.',
  materials: [
    {
      id: 1,
      title: '🕯️ Kit de Velas & Rosas',
      description: 'Materiais utilizados: 1 vela de casal em escultura, 1 vela de abertura de caminhos, 3 incensos de rosas, papel rosa consagrado e feitiço de descarrego no altar de Oxum e Maria Padilha.',
      category: 'Oferenda Principal',
      type: 'request',
      icon: 'sparkles',
      url: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
    {
      id: 2,
      title: '📜 Oração Secreta de Maria Padilha & Oxum (PDF)',
      description: 'Guia completo de orações em PDF para atração e descarrego. Liberado imediatamente após a solicitação.',
      category: 'E-book Exclusivo',
      type: 'download',
      icon: 'copy',
      url: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
    {
      id: 3,
      title: '📿 Entrar na Comunidade de Orações Diárias',
      description: 'Acesso VIP ao grupo de rezas diárias de atração, proteção e blindagem do casal.',
      category: 'Comunidade VIP',
      type: 'request',
      icon: 'bot',
      url: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
    {
      id: 4,
      title: '🔮 Ritual de Abertura Financeira',
      description: 'Limpeza de inveja, mau olhado e bloqueios de prosperidade no ambiente familiar.',
      category: 'Ritual Complementar',
      type: 'request',
      icon: 'sparkles',
      url: 'https://lastlink.com/p/C03402B87/checkout-payment/',
    },
  ],

  // ─── Bônus ──────────────────────────────────────────────
  bonusTitulo: 'Bônus Exclusivos de Acompanhamento',
  bonusSubtitulo: 'Estes bônus ficam disponíveis assim que a solicitação dos materiais for confirmada.',
  bonus: [
    {
      titulo: '🗓️ Acompanhamento de 7 Dias com Safira Oráculo',
      descricao: 'Orientação espiritual diária no WhatsApp durante os 7 dias após o início do trabalho para direcionar cada atitude no relacionamento.',
      icone: 'sparkles',
    },
    {
      titulo: '💬 Guia Secreto de Mensagens & Respostas',
      descricao: 'Roteiro exato das mensagens para enviar para a pessoa amada e como responder a cada reação dela.',
      icone: 'wand',
    },
    {
      titulo: '📜 Oração Diária em PDF de Blindagem de Casal',
      descricao: 'Reza de descarrego para afastar rivais, inveja e fofocas.',
      icone: 'chart',
    },
  ],

  // ─── Planos ─────────────────────────────────────────────
  planosTitulo: 'Solicitação dos Materiais do Altar:',
  planos: [
    {
      nome: 'Kit Completo de Materiais + Acompanhamento durante 7 Dias',
      valor: 'R$ 60,00',
      descricao: 'Materiais do altar + Guia de Mensagens + Acompanhamento de 7 dias com Safira Oráculo.',
    },
  ],
  planosTotal: 'R$ 60,00',
  planosParcela: 'R$ 60',
  planosAVista: 'R$ 60,00',
  planosCta: 'CONFIRMAR SOLICITAÇÃO DOS MATERIAIS',
  planosGarantia: 'Solicitação 100% Segura · Mão de Obra Grátis · Liberação Imediata',
};

export const STORAGE = {
  config: 'safira_config_v9',
  requests: 'safira_requests_v9',
  vslConcluida: 'safira_vsl_concluida_v9',
  vslPosicao: 'safira_vsl_posicao_v9',
  quizConcluido: 'safira_quiz_concluido_v9',
  quizEstado: 'safira_quiz_estado_v9',
};
