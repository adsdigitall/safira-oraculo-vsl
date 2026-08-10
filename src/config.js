// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO SAFIRA ORÁCULO
// ─────────────────────────────────────────────────────────────

export const CONFIG_PADRAO = {
  // ─── Marca ───────────────────────────────────────────────
  productName: 'Safira Oráculo',
  subTitle: 'Especialista em Relacionamento Amoroso',
  logoUrl: '',

  // ─── Rastreamento (Pixel) ────────────────────────────────
  pixelId: '1374470023595160', // Meta Pixel Facebook registrado pelo usuário

  // ─── Links de conversão ──────────────────────────────────
  checkoutUrl: 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl',
  whatsappLink: 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl',

  // ─── Barra lateral ───────────────────────────────────────
  dicaSidebar: 'Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais',
  ctaSidebar: 'Solicitar Materiais',

  // ─── VSL (tela "Início") ─────────────────────────────────
  vslUrl: 'https://play-v2.tynk.ai/ab/102d94a9-3961-49f6-b6fb-58f59adcc0a8',
  vslDuracaoSegundos: 150,
  vslAspectRatio: '4:5', // '16:9', '4:5' ou '9:16'

  // ─── Gerenciador de Variações VSL (A/B Test Multi-Checkout) ─
  variacoes: [
    {
      id: 'v1',
      slug: '1',
      nome: 'VSL 1 — Principal (Rodando)',
      vslUrl: 'https://play-v2.tynk.ai/ab/102d94a9-3961-49f6-b6fb-58f59adcc0a8',
      checkoutUrl: 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl',
      vslAspectRatio: '4:5',
      planosTotal: 'R$ 40,00',
    },
    {
      id: 'v2',
      slug: '2',
      nome: 'VSL 2 — Teste B',
      vslUrl: 'https://play-v2.tynk.ai/ab/102d94a9-3961-49f6-b6fb-58f59adcc0a8',
      checkoutUrl: 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl',
      vslAspectRatio: '9:16',
      planosTotal: 'R$ 40,00',
    },
    {
      id: 'v3',
      slug: '3',
      nome: 'VSL 3 — Teste C',
      vslUrl: 'https://play-v2.tynk.ai/ab/102d94a9-3961-49f6-b6fb-58f59adcc0a8',
      checkoutUrl: 'https://ggcheckout.app/checkout/v2/K5qJrW0VINjwRkiJydnl',
      vslAspectRatio: '16:9',
      planosTotal: 'R$ 60,00',
    },
  ],

  vslTitle: '🔥 VÁRIAS PESSOAS ESTÃO ACABANDO DE ASSISTIR A ESSE VÍDEO — POUCAS VAGAS DISPONÍVEIS NO ALTAR',
  vslLinhas: [
    { texto: 'Siga os passos simples para a liberação do seu trabalho:' },
    { forte: 'Passo 1:', texto: 'Assista o vídeo até o final.' },
    { forte: 'Passo 2:', texto: 'Conscientize-se sobre os materiais do altar.' },
    { forte: 'Passo 3:', texto: 'Solicite os seus materiais na barra lateral.' },
  ],

  avisoBloqueado: '🔒 Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais',

  // ─── Tela "Materiais" com Links Individuais e Gestão Admin ─
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
      url: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',
    },
    {
      id: 2,
      title: '📜 Oração Secreta de Maria Padilha & Oxum (PDF)',
      description: 'Guia completo de orações em PDF para atração e descarrego. Liberado imediatamente após a solicitação.',
      category: 'E-book Exclusivo',
      type: 'download',
      icon: 'copy',
      url: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',
    },
    {
      id: 3,
      title: '📿 Entrar na Comunidade de Orações Diárias',
      description: 'Acesso VIP ao grupo de rezas diárias de atração, proteção e blindagem do casal.',
      category: 'Comunidade VIP',
      type: 'request',
      icon: 'bot',
      url: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',
    },
    {
      id: 4,
      title: '🔮 Ritual de Abertura Financeira',
      description: 'Limpeza de inveja, mau olhado e bloqueios de prosperidade no ambiente familiar.',
      category: 'Ritual Complementar',
      type: 'request',
      icon: 'sparkles',
      url: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',
    },
  ],

  // ─── Tela "Bônus" ────────────────────────────────────────
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

  // ─── Tela "Planos" / Desbloqueio ─────────────────────────
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

  // ─── QUIZ DE ENTRADA (Leitura das Cartas) ────────────────
  // Funil que roda ANTES da área de membros. Modelado no estilo
  // "escolha suas cartas": intro → perguntas → transição → cartas → resultado.
  quizAtivo: true,

  // Logo e imagem da personagem no topo da intro (deixe vazio p/ ocultar).
  quizLogoUrl: '',
  quizHeroUrl: '/luna.jpg', // foto da sua personagem/sensitiva com as cartas na mesa (carregamento ultra rápido <20ms)

  quizIntroTitulo: 'Descubra Agora o Que as Cartas Revelam Sobre a Sua Vida Neste Ano De 2026!',
  quizIntroTexto: 'As cartas podem revelar o caminho exato para',
  quizIntroTextoForte: 'destravar a sua vida.',
  quizIntroCta: 'FAZER LEITURA GRATUITA',
  quizIntroRodape: '+2.148 leituras realizadas nesta semana',

  quizPerguntas: [
    {
      titulo: 'Qual dessas frases mais descreve o que você está sentindo esse ano?',
      opcoes: [
        { rotulo: 'Sinto que a minha vida está travada, mesmo fazendo tudo certo.', icone: '😪' },
        { rotulo: 'Tenho tudo pra ser feliz, mas ainda sinto um vazio por dentro.', icone: '😔' },
        { rotulo: 'Estou numa decisão importante e não sei qual caminho escolher.', icone: '😮' },
        { rotulo: 'Sinto que algo grande está prestes a mudar, mas não sei o que.', icone: '🤔' },
      ],
    },
    {
      titulo: 'Quando você pensa nas suas relações... Qual frase combina mais com o que você sente?',
      opcoes: [
        { rotulo: 'Me doo completamente pelas pessoas, mas quando preciso... Estou sozinha.', icone: '💔' },
        { rotulo: 'Sinto que carrego tudo nas costas enquanto os outros seguem em frente.', icone: '🙁' },
        { rotulo: 'Já doei tanto de mim que nem sei mais o que sobrou pra mim mesma.', icone: '😓' },
        { rotulo: 'Sinto que meu amor e minha energia nunca são suficientes para ninguém.', icone: '🥺' },
      ],
    },
    {
      titulo: 'O que você espera de mudança este ano para sua vida?',
      opcoes: [
        { rotulo: 'Melhorar minha situação financeira.', icone: '💰' },
        { rotulo: 'Encontrar o meu grande amor.', icone: '💌' },
        { rotulo: 'Encontrar a minha paz interior.', icone: '🍀' },
        { rotulo: 'Encontrar a minha direção e propósito de vida.', icone: '🙏' },
      ],
    },
    {
      titulo:
        'Você já teve a sensação de olhar ao redor e ver todo mundo avançando... Mas sentir que você ainda está travada no mesmo lugar?',
      opcoes: [
        { rotulo: 'Sim, me identifico completamente!', icone: '✅' },
        { rotulo: 'Às vezes... mas acho que é só uma fase.', icone: '🤔' },
        { rotulo: 'Tenho esse sentimento, mas não sei explicar de onde vem.', icone: '❓' },
      ],
    },
    {
      etiqueta: '(Última pergunta antes da sua leitura)',
      intro:
        'Se as cartas revelassem HOJE o que está bloqueando sua vida e te mostrassem o caminho exato para desbloquear...',
      titulo: 'Você estaria pronta para seguir essa orientação?',
      opcoes: [
        { rotulo: 'Sim, estou pronta para receber.', icone: '✅' },
        { rotulo: 'Sim, mas tenho medo de me decepcionar de novo.', icone: '😔' },
        { rotulo: 'Não sei, depende do que as cartas disserem.', icone: '🤔' },
      ],
    },
  ],

  // Tela de transição (diagnóstico) entre as perguntas e as cartas.
  quizTransicaoLinhas: [
    'A partir do que você me revelou...',
    'O universo irá filtrar, entre milhares de combinações possíveis...',
    'As únicas 8 cartas capazes de falar diretamente com a sua energia neste momento.',
  ],
  quizTransicaoDestaque: 'Prepare-se.',
  quizTransicaoCarregando: 'Analisando suas respostas...',
  // Etapas do diagnóstico (marcam conforme a % avança).
  quizDiagPassos: [
    'Lendo a energia das suas respostas',
    'Cruzando os seus sentimentos com os cristais',
    'Identificando o bloqueio principal',
    'Selecionando as suas 8 cartas',
  ],

  quizCartasTitulo: 'Os cristais estão abertos para você:',
  quizCartasSubtitulo: 'Não pense muito, apenas sinta.',
  quizCartasInstrucao: 'Escolha 3 cartas, uma de cada vez, na ordem que o seu instinto mandar:',
  // Os 8 VERSOS (iscas) — só decoração dourada de frente pra baixo.
  //   verso   → arte dourada ornamentada (URL). Sem verso, usa o SVG padrão.
  //   simbolo → emblema no medalhão do verso SVG (fallback quando não há arte).
  quizCartas: [
    { nome: 'A Lua', simbolo: '🌙', verso: '/cartas/verso-1-lua.png' },
    { nome: 'A Estrela', simbolo: '⭐', verso: '/cartas/verso-2-estrela.png' },
    { nome: 'O Sol', simbolo: '☀️', verso: '/cartas/verso-3-sol.png' },
    { nome: 'A Mandala', simbolo: '🌼', verso: '/cartas/verso-4-mandala.png' },
    { nome: 'Os Frutos', simbolo: '🍎', verso: '/cartas/verso-5-frutos.png' },
    { nome: 'O Lótus', simbolo: '🪷', verso: '/cartas/verso-6-lotus.png' },
    { nome: 'As Rosas', simbolo: '🌹', verso: '/cartas/verso-7-rosas.png' },
    { nome: 'O Cálice', simbolo: '🍇', verso: '/cartas/verso-8-calice.png' },
  ],
  quizCartasQtd: 3,
  quizSomAtivo: true, // efeito sonoro ao virar a carta

  // As 3 CARTAS REVELADAS FIXAS. Não importa qual verso o lead clique,
  // o 1º clique revela a 1ª daqui, o 2º a 2ª, o 3º a 3ª — sempre iguais.
  //   frente → arte colorida do tarô (URL). Sem arte, usa placeholder místico.
  quizCartasReveladas: [
    { nome: 'Flecha no Coração', simbolo: '💘', frente: '/cartas/frente-1-flecha.png' },
    { nome: 'Traição', simbolo: '🗡️', frente: '/cartas/frente-2-traicao.png' },
    { nome: 'A Torre', simbolo: '🗼', frente: '/cartas/frente-3-torre.png' },
  ],

  quizRevelandoTexto: 'Conectando com os guias e lendo suas cartas...',

  quizResultadoTag: 'Sua leitura está pronta',
  quizResultadoTitulo: 'As cartas expuseram o que estava escondido de você',
  quizResultadoTexto:
    'Não foi coincidência. Você tirou a Flecha no Coração, a Traição e a Torre — juntas, elas revelam uma ferida que ainda sangra, uma quebra de confiança que te marcou e uma estrutura da sua vida prestes a ruir se nada for feito. Existe um bloqueio espiritual pesado te prendendo no mesmo lugar. Mas há caminho de volta — e eu preparei a revelação completa a seguir mostrando exatamente o que precisa ser feito no altar para reverter tudo isso.',
  quizResultadoCta: 'Ver minha revelação completa',
};

export const STORAGE = {
  config: 'safira_config_v8',
  requests: 'safira_requests_v8',
  vslConcluida: 'safira_vsl_concluida_v8',
  vslPosicao: 'safira_vsl_posicao_v8',
  quizConcluido: 'safira_quiz_concluido_v8',
  quizEstado: 'safira_quiz_estado_v8',
};
