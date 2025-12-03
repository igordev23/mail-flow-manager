import { Email, BrazilianState, BrazilianCity, DashboardData, EmailStats } from '@/types/email';

export const brazilianStates: BrazilianState[] = [
  { code: 'PI', name: 'Piauí' },
  { code: 'CE', name: 'Ceará' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'BA', name: 'Bahia' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'PR', name: 'Paraná' },
];

export const brazilianCities: BrazilianCity[] = [
  // Piauí
  { name: 'Teresina', stateCode: 'PI' },
  { name: 'Piripiri', stateCode: 'PI' },
  { name: 'Parnaíba', stateCode: 'PI' },
  { name: 'Picos', stateCode: 'PI' },
  // Ceará
  { name: 'Fortaleza', stateCode: 'CE' },
  { name: 'Sobral', stateCode: 'CE' },
  { name: 'Juazeiro do Norte', stateCode: 'CE' },
  { name: 'Crato', stateCode: 'CE' },
  // Maranhão
  { name: 'São Luís', stateCode: 'MA' },
  { name: 'Imperatriz', stateCode: 'MA' },
  { name: 'Caxias', stateCode: 'MA' },
  // São Paulo
  { name: 'São Paulo', stateCode: 'SP' },
  { name: 'Campinas', stateCode: 'SP' },
  { name: 'Santos', stateCode: 'SP' },
  // Rio de Janeiro
  { name: 'Rio de Janeiro', stateCode: 'RJ' },
  { name: 'Niterói', stateCode: 'RJ' },
  { name: 'Petrópolis', stateCode: 'RJ' },
  // Bahia
  { name: 'Salvador', stateCode: 'BA' },
  { name: 'Feira de Santana', stateCode: 'BA' },
  // Pernambuco
  { name: 'Recife', stateCode: 'PE' },
  { name: 'Olinda', stateCode: 'PE' },
  // Minas Gerais
  { name: 'Belo Horizonte', stateCode: 'MG' },
  { name: 'Uberlândia', stateCode: 'MG' },
  // Rio Grande do Sul
  { name: 'Porto Alegre', stateCode: 'RS' },
  { name: 'Caxias do Sul', stateCode: 'RS' },
  // Paraná
  { name: 'Curitiba', stateCode: 'PR' },
  { name: 'Londrina', stateCode: 'PR' },
];

const generateDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 10) + 8);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Proposta Comercial X',
    body: 'Prezados,\n\nSegue em anexo a proposta referente ao projeto X conforme conversamos.\n\nFico no aguardo do de acordo.\n\nAtenciosamente,\nJoão Silva',
    date: generateDate(0),
    state: 'PI',
    city: 'Piripiri',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '2',
    sender: 'maria@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Fatura Mensal - Dezembro',
    body: 'Prezado cliente,\n\nSegue em anexo a fatura referente aos serviços prestados no mês de dezembro.\n\nAtenciosamente,\nMaria Santos',
    date: generateDate(0),
    state: 'CE',
    city: 'Fortaleza',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '3',
    sender: 'ana@empresa.com',
    recipient: 'clienteD@dominio.com',
    subject: 'Agendamento de Reunião',
    body: 'Olá,\n\nGostaria de agendar uma reunião para discutirmos os próximos passos do projeto.\n\nPor favor, me informe sua disponibilidade.\n\nAbraços,\nAna Oliveira',
    date: generateDate(0),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '4',
    sender: 'pedro@empresa.com',
    recipient: 'clienteC@dominio.com',
    subject: 'Relatório Técnico',
    body: 'Prezados,\n\nEncaminho o relatório técnico conforme solicitado.\n\nQualquer dúvida, estou à disposição.\n\nAtenciosamente,\nPedro Costa',
    date: generateDate(0),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '5',
    sender: 'joao@empresa.com',
    recipient: 'clienteE@dominio.com',
    subject: 'Orçamento Atualizado',
    body: 'Prezado cliente,\n\nConforme solicitado, segue o orçamento atualizado para o projeto.\n\nAguardo retorno.\n\nAtt,\nJoão Silva',
    date: generateDate(1),
    state: 'MA',
    city: 'São Luís',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(1),
    updatedAt: generateDate(1),
  },
  {
    id: '6',
    sender: 'maria@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Confirmação de Pagamento',
    body: 'Prezado,\n\nConfirmamos o recebimento do pagamento referente à fatura #123.\n\nAgradecemos a parceria.\n\nAtenciosamente,\nMaria Santos',
    date: generateDate(1),
    state: 'SP',
    city: 'São Paulo',
    status: 'classified',
    isManual: true,
    createdAt: generateDate(1),
    updatedAt: generateDate(1),
  },
  {
    id: '7',
    sender: 'carlos@empresa.com',
    recipient: 'clienteF@dominio.com',
    subject: 'Suporte Técnico - Ticket #456',
    body: 'Olá,\n\nSeu chamado foi registrado com sucesso. Nossa equipe entrará em contato em breve.\n\nAtt,\nCarlos Mendes',
    date: generateDate(2),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(2),
    updatedAt: generateDate(2),
  },
  {
    id: '8',
    sender: 'ana@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Material de Treinamento',
    body: 'Prezados,\n\nSegue o material do treinamento realizado ontem.\n\nQualquer dúvida, estou à disposição.\n\nAbraços,\nAna Oliveira',
    date: generateDate(2),
    state: 'RJ',
    city: 'Rio de Janeiro',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(2),
    updatedAt: generateDate(2),
  },
  {
    id: '9',
    sender: 'pedro@empresa.com',
    recipient: 'clienteG@dominio.com',
    subject: 'Contrato de Prestação de Serviços',
    body: 'Prezado cliente,\n\nSegue em anexo o contrato para análise e assinatura.\n\nFico no aguardo.\n\nAtenciosamente,\nPedro Costa',
    date: generateDate(3),
    state: 'PI',
    city: 'Teresina',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(3),
    updatedAt: generateDate(3),
  },
  {
    id: '10',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Follow-up Proposta',
    body: 'Prezado,\n\nGostaria de saber se teve oportunidade de analisar nossa proposta.\n\nAguardo retorno.\n\nAtt,\nJoão Silva',
    date: generateDate(4),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(4),
    updatedAt: generateDate(4),
  },
];

export const getDashboardData = (emails: Email[]): DashboardData => {
  const stats: EmailStats = {
    total: emails.length,
    classified: emails.filter(e => e.status === 'classified').length,
    pending: emails.filter(e => e.status === 'pending').length,
  };

  const stateCount: Record<string, number> = {};
  emails.forEach(email => {
    if (email.state) {
      stateCount[email.state] = (stateCount[email.state] || 0) + 1;
    }
  });
  const emailsByState = Object.entries(stateCount)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  const dayCount: Record<string, number> = {};
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  last7Days.forEach(day => { dayCount[day] = 0; });
  emails.forEach(email => {
    const day = email.date.toISOString().split('T')[0];
    if (dayCount[day] !== undefined) {
      dayCount[day]++;
    }
  });
  const emailsByDay = Object.entries(dayCount)
    .map(([date, count]) => ({ date, count }));

  const recipientCount: Record<string, number> = {};
  emails.forEach(email => {
    recipientCount[email.recipient] = (recipientCount[email.recipient] || 0) + 1;
  });
  const topRecipients = Object.entries(recipientCount)
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return { stats, emailsByState, emailsByDay, topRecipients };
};
