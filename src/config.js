// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO SAFIRA ORÁCULO
// ─────────────────────────────────────────────────────────────

export const CONFIG_PADRAO = {
  // ─── Marca ───────────────────────────────────────────────
  productName: 'Safira Oráculo',
  subTitle: 'Especialista em Relacionamento Amoroso',
  logoUrl: '',

  // ─── Rastreamento (Pixel) ────────────────────────────────
  pixelId: '', // Ex: 1234567890 (Meta Pixel Facebook)

  // ─── Links de conversão ──────────────────────────────────
  checkoutUrl: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',
  whatsappLink: 'https://pay.cakto.com.br/SEU-LINK-DE-CHECKOUT',

  // ─── Barra lateral ───────────────────────────────────────
  dicaSidebar: 'Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais',
  ctaSidebar: 'Solicitar Materiais',

  // ─── VSL (tela "Início") ─────────────────────────────────
  vslUrl: 'https://play.tynk.ai/p/ab96290d-0eaa-4757-a7bd-47aee4fe76ee',
  vslDuracaoSegundos: 150,

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
};

export const STORAGE = {
  config: 'safira_config_v8',
  requests: 'safira_requests_v8',
  vslConcluida: 'safira_vsl_concluida_v8',
  vslPosicao: 'safira_vsl_posicao_v8',
};
