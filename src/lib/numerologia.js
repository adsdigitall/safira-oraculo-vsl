// ─────────────────────────────────────────────────────────────
//  MOTOR DE CÁLCULO NUMEROLÓGICO PITAGÓRICO & ARQUÉTIPOS DA ALMA
// ─────────────────────────────────────────────────────────────

export const TABELA_PITAGORICA = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

export const MESES_DO_ANO = [
  { id: 1, nome: 'Janeiro', numero: 1, signo: 'Capricórnio / Aquário', elemento: 'Terra / Ar', frequencia: 'Iniciação & Liderança' },
  { id: 2, nome: 'Fevereiro', numero: 2, signo: 'Aquário / Peixes', elemento: 'Ar / Água', frequencia: 'Intuição & Parcerias' },
  { id: 3, nome: 'Março', numero: 3, signo: 'Peixes / Áries', elemento: 'Água / Fogo', frequencia: 'Magnetismo & Expansão' },
  { id: 4, nome: 'Abril', numero: 4, signo: 'Áries / Touro', elemento: 'Fogo / Terra', frequencia: 'Estrutura & Concretização' },
  { id: 5, nome: 'Maio', numero: 5, signo: 'Touro / Gêmeos', elemento: 'Terra / Ar', frequencia: 'Transformação & Virada' },
  { id: 6, nome: 'Junho', numero: 6, signo: 'Gêmeos / Câncer', elemento: 'Ar / Água', frequencia: 'Amor & Harmonização' },
  { id: 7, nome: 'Julho', numero: 7, signo: 'Câncer / Leão', elemento: 'Água / Fogo', frequencia: 'Sabedoria & Espiritualidade' },
  { id: 8, nome: 'Agosto', numero: 8, signo: 'Leão / Virgem', elemento: 'Fogo / Terra', frequencia: 'Poder & Prosperidade' },
  { id: 9, nome: 'Setembro', numero: 9, signo: 'Virgem / Libra', elemento: 'Terra / Ar', frequencia: 'Cura & Elevação' },
  { id: 10, nome: 'Outubro', numero: 1, signo: 'Libra / Escorpião', elemento: 'Ar / Água', frequencia: 'Renovação de Ciclos' },
  { id: 11, nome: 'Novembro', numero: 11, signo: 'Escorpião / Sagitário', elemento: 'Água / Fogo', frequencia: 'Portal Mestre de Luz' },
  { id: 12, nome: 'Dezembro', numero: 3, signo: 'Sagitário / Capricórnio', elemento: 'Fogo / Terra', frequencia: 'Celebração & Plenitude' },
];

export const FREQUENCIAS_SAGRADAS = [
  {
    id: 1,
    numero: 3,
    titulo: 'Chama da Manifestação',
    subtitulo: 'Frequência do Magnetismo',
    descricao: 'Destrava a energia da atração e desbloqueia oportunidades rápidas.',
    icone: '✨',
    corGradiente: 'from-amber-500 to-yellow-300',
  },
  {
    id: 2,
    numero: 7,
    titulo: 'Olho da Sabedoria Divina',
    subtitulo: 'Frequência da Intuição',
    descricao: 'Dissolve ilusões e afasta energias densas do seu caminho.',
    icone: '👁️',
    corGradiente: 'from-purple-600 to-indigo-400',
  },
  {
    id: 3,
    numero: 8,
    titulo: 'Infinito da Abundância',
    subtitulo: 'Frequência da Prosperidade',
    descricao: 'Quebra bloqueios financeiros e abre os portais de riqueza.',
    icone: '♾️',
    corGradiente: 'from-amber-400 to-amber-600',
  },
  {
    id: 4,
    numero: 9,
    titulo: 'Quebra de Laços Kármicos',
    subtitulo: 'Frequência da Libertação',
    descricao: 'Corta padrões repetitivos do passado e encerra ciclos de dor.',
    icone: '🕊️',
    corGradiente: 'from-rose-500 to-amber-300',
  },
  {
    id: 5,
    numero: 11,
    titulo: 'Portal Mestre Iluminado',
    subtitulo: 'Frequência da Clarividência',
    descricao: 'Alinha seu espírito ao seu propósito sagrado e revela a verdade.',
    icone: '🔮',
    corGradiente: 'from-violet-500 to-cyan-300',
  },
  {
    id: 6,
    numero: 22,
    titulo: 'Arquiteto Cósmico',
    subtitulo: 'Frequência da Materialização',
    descricao: 'Consolidação de segurança e proteção duradoura para o seu futuro.',
    icone: '🏛️',
    corGradiente: 'from-blue-600 to-teal-300',
  },
  {
    id: 7,
    numero: 33,
    titulo: 'Escudo Crístico Protetor',
    subtitulo: 'Frequência do Amor Sagrado',
    descricao: 'Blindagem contra inveja, energias contrárias e cura afetiva.',
    icone: '🛡️',
    corGradiente: 'from-amber-300 to-yellow-500',
  },
  {
    id: 8,
    numero: 44,
    titulo: 'Transmutação da Alma',
    subtitulo: 'Frequência da Regeneração',
    descricao: 'Cura energética profunda e renovação de força vital.',
    icone: '💎',
    corGradiente: 'from-indigo-600 to-purple-400',
  },
];

export const ARQUETIPOS_NUMEROLOGICOS = {
  1: {
    nome: 'O Pioneiro Cósmico',
    palavraChave: 'Abertura de Caminhos e Liderança',
    bloqueio: 'Medo de errar e excesso de autocrítica',
    destravamento: 'Início de uma nova fase com autoridade e independência',
  },
  2: {
    nome: 'A Harmonia Sagrada',
    palavraChave: 'Cura Emocional e Parcerias',
    bloqueio: 'Insegurança afetiva e medo do abandono',
    destravamento: 'Restauração do magnetismo no amor e paz interior',
  },
  3: {
    nome: 'O Magneto da Criação',
    palavraChave: 'Expansão, Brilho e Abundância',
    bloqueio: 'Sentimento de não ser ouvida ou valorizada',
    destravamento: 'Ativação do carisma e desbloqueio de ganhos financeiros',
  },
  4: {
    nome: 'A Fortaleza Estável',
    palavraChave: 'Segurança Material e Estrutura',
    bloqueio: 'Sensação de cansaço extremo por carregar tudo',
    destravamento: 'Estabilidade sólida e colheita do esforço acumulado',
  },
  5: {
    nome: 'O Agente da Virada',
    palavraChave: 'Transformação Rápida e Libertação',
    bloqueio: 'Sensação de estar presa numa rotina estagnada',
    destravamento: 'Grande virada de chave e novos caminhos inesperados',
  },
  6: {
    nome: 'O Guardião do Amor',
    palavraChave: 'Reconciliação e Blindagem Familiar',
    bloqueio: 'Doar-se demais e receber ingratidão em troca',
    destravamento: 'Cura de mágoas e atração de um amor sincero e respeitoso',
  },
  7: {
    nome: 'O Sábio Místico',
    palavraChave: 'Intuição Divina e Conexão Superior',
    bloqueio: 'Dúvidas constantes e mente hiperativa',
    destravamento: 'Clareza cristalina para tomar a decisão correta',
  },
  8: {
    nome: 'O Soberano da Prosperidade',
    palavraChave: 'Poder de Manifestação e Riqueza',
    bloqueio: 'Dinheiro que entra mas escorre pelas mãos rapidamente',
    destravamento: 'Ativação do fluxo contínuo de abundância e justiça',
  },
  9: {
    nome: 'O Alquimista da Conclusão',
    palavraChave: 'Libertação Kármica e Elevação',
    bloqueio: 'Prender-se a pessoas ou acontecimentos do passado',
    destravamento: 'Corte definitivo de laços tóxicos e renascimento',
  },
  11: {
    nome: 'O Portal da Iluminação (Mestre)',
    palavraChave: 'Sensibilidade Extrema e Luz',
    bloqueio: 'Absorver a energia pesada de ambientes e pessoas',
    destravamento: 'Canal de manifestação espiritual e proteção máxima',
  },
  22: {
    nome: 'O Construtor de Destinos (Mestre)',
    palavraChave: 'Materialização de Sonhos Gigantes',
    bloqueio: 'Sentir que seu potencial está adormecido',
    destravamento: 'Conquistas grandiosas e realização do seu grande plano',
  },
  33: {
    nome: 'O Mestre do Amor Universal (Mestre)',
    palavraChave: 'Bênção Máxima e Cura Suprema',
    bloqueio: 'Sobrecarga de sofrimento alheio no próprio coração',
    destravamento: 'Graça divina concedida para pacificar qualquer aflição',
  },
};

/**
 * Reduz um número até 1-9 ou mantém os números mestres 11, 22, 33
 */
export function reduzirPitagorico(num) {
  if (num === 11 || num === 22 || num === 33 || num === 44) return num;
  if (num < 10) return num;
  const soma = String(num)
    .split('')
    .reduce((acc, digito) => acc + parseInt(digito, 10), 0);
  return soma > 9 && soma !== 11 && soma !== 22 && soma !== 33 && soma !== 44
    ? reduzirPitagorico(soma)
    : soma;
}

/**
 * Calcula a vibração do nome pela tabela de Pitágoras
 */
export function calcularVibracaoNome(nome) {
  if (!nome || typeof nome !== 'string') return 7;
  const letras = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  if (!letras.length) return 7;

  let soma = 0;
  for (const letra of letras) {
    soma += TABELA_PITAGORICA[letra] || 0;
  }

  return reduzirPitagorico(soma);
}

/**
 * Calcula o Ano Pessoal de 2026 com base no mês de nascimento
 */
export function calcularAnoPessoal(mesId, anoAtual = 2026) {
  const mes = parseInt(mesId, 10) || 7;
  // 2026 -> 2 + 0 + 2 + 6 = 10 -> 1
  const somaAno = 1;
  return reduzirPitagorico(mes + somaAno);
}

/**
 * Retorna os detalhes completos do mapa numerológico
 */
export function obterDetalhesMapa({ nome, mesId, frequenciasEscolhidas = [] }) {
  const vibracaoNome = calcularVibracaoNome(nome || 'Alma Buscadora');
  const anoPessoal = calcularAnoPessoal(mesId || 7);
  const mesObj = MESES_DO_ANO.find((m) => m.id === Number(mesId)) || MESES_DO_ANO[6];
  
  // Número de Destino final combinado
  const numFinal = reduzirPitagorico(vibracaoNome + anoPessoal);
  const arquetipo = ARQUETIPOS_NUMEROLOGICOS[numFinal] || ARQUETIPOS_NUMEROLOGICOS[8];

  return {
    nomeLimpo: (nome || '').trim() || 'Visitante Iluminada',
    vibracaoNome,
    anoPessoal,
    mesObj,
    numFinal,
    arquetipo,
    frequencias: frequenciasEscolhidas,
  };
}
