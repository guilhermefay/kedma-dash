// ─── Kedma Marketing Dashboard · Data Layer ─────────────────────────────────
// Dados reais extraídos da planilha do Grupo KEDMA + call com Gil (Head Mkt)

// ─── Types ───────────────────────────────────────────────────────────────────

export type FunilId = 'todos' | 'webinario' | 'isca' | 'aplicacao' | 'ss';

export interface MetaMes {
  investimento: number;
  faturamento: number;
  roas: number;
  vendas: number;
  cpaLimite: number;
}

export interface DadoDiario {
  data: string;
  inv: number;
  leads: number;
  cpl: number;
  mqls: number;
  cpmql: number;
  pctMql: number;
  sdrAgend: number;
  agendNoDia: number;
  calls: number;
  callsPorCloser: number;
  vendas: number;
  pctConv: number;
  fat: number;
  roas: number;
  cpa: number;
}

export interface Totais {
  inv: number;
  leads: number;
  mqls: number;
  pctMql: number;
  sdrAgend: number;
  pctSdrAgend: number;
  agendNoDia: number;
  calls: number;
  pctCalls: number;
  callsPorCloser: number;
  vendas: number;
  pctConv: number;
  fat: number;
  roas: number;
  cpa: number;
}

export interface Farol {
  label: string;
  valor: number;
  meta: number;
  unidade: string;
  desc: string;
}

export interface FunilData {
  id: FunilId;
  nome: string;
  inv: number;
  invMeta: number;
  invPct: number;    // % do budget total
  invDiario: number; // investimento diário projetado
  leads: number;
  mqls: number;
  vendas: number;
  fat: number;
  roas: number;
  cor: string;
}

export interface FunilStep {
  label: string;
  valor: string;
  sub: string;
  pct: string | null;
  area: 'marketing' | 'comercial';
}

export interface HistoricoMes {
  mes: string;
  roas: number;
  cpl: number;
  inv: number;
  leads?: number;
  mqls?: number;
  pctMql?: number;
  vendas?: number;
  fat?: number;
}

export interface ConversaoEtapa {
  etapa: string;
  volume: string;
  taxa: string;
  meta: string;
  status: 'ok' | 'warn' | 'danger' | null;
}

export interface MetaFunil {
  funil: FunilId;
  nome: string;
  meta: { fat: number; inv: number; leads: number; roas: number; conv: number; alunos: number; ticket: number; cpl: number; pctMql: number };
  superMeta: { fat: number; leads: number; roas: number; conv: number; alunos: number; cpl: number; pctMql: number };
  megaMeta: { fat: number; leads: number; roas: number; conv: number; alunos: number; cpl: number; pctMql: number };
}

export interface WebinarioDiario {
  data: string;
  inv: number;
  leads: number;
  cpl: number;
  mqls: number;
  pctMql: number;
  custoMql: number;
  cpm: number;
  ctr: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const META_MES: MetaMes = {
  investimento: 300000,
  faturamento: 1487500,
  roas: 8.1,
  vendas: 205,
  cpaLimite: 400,
};

export const DIAS_MES = 31;
export const DIAS_PASSADOS = 5;
export const MES_LABEL = 'Março 2026';
export const DATA_ATUALIZACAO = '05/03/2026';
export const INV_DIARIO_META = 9677.42;

// ─── Projeção & Alocação por Funil ──────────────────────────────────────────

export const PROJECAO = {
  metaInv: 300000,
  funis: [
    { id: 'webinario' as FunilId, nome: 'Webinario',        pct: 0.45, projecao: 135000, invDiario: 4354.84, obs: '30 criativos (6 chegando), já temos 26 rodando' },
    { id: 'ss' as FunilId,        nome: 'Social Selling',   pct: 0.25, projecao: 75000,  invDiario: 2419.35, obs: 'Shay analisa e envia no whatsapp' },
    { id: 'isca' as FunilId,      nome: 'Funil Isca',       pct: 0.20, projecao: 60000,  invDiario: 1935.48, obs: '10 criativos por funil | semanal, 70% funil teste A e 30% funil teste B' },
    { id: 'aplicacao' as FunilId, nome: 'Aplicacao Direta',  pct: 0.10, projecao: 30000,  invDiario: 967.74,  obs: '5-10 (video e estático) | semanal' },
  ],
  semanas: {
    semana01: 75000,
    semana02: 75000,
    semana03: 75000,
    semana04: 75000,
  },
  extras: '400 a mais SS, 1k a mais webinario',
};

// ─── Metas Detalhadas por Funil (META / SUPER META / MEGA META) ─────────────

export const METAS_POR_FUNIL: MetaFunil[] = [
  {
    funil: 'webinario', nome: 'Webinario',
    meta:      { fat: 1350000, inv: 135000, leads: 1425, roas: 10,   conv: 0.06,   alunos: 159, ticket: 8500, cpl: 90,  pctMql: 0 },
    superMeta: { fat: 1485000,              leads: 1603, roas: 11,   conv: 0.075,  alunos: 175,               cpl: 80,  pctMql: 0 },
    megaMeta:  { fat: 1620000,              leads: 1832, roas: 12,   conv: 0.081,  alunos: 191,               cpl: 70,  pctMql: 0 },
  },
  {
    funil: 'isca', nome: 'Funil Isca',
    meta:      { fat: 600000, inv: 60000, leads: 3750, roas: 10, conv: 0.0188, alunos: 71, ticket: 8500, cpl: 16, pctMql: 0.80 },
    superMeta: { fat: 660000,             leads: 4286, roas: 11, conv: 0.0181, alunos: 78,               cpl: 14, pctMql: 0.85 },
    megaMeta:  { fat: 720000,             leads: 5000, roas: 12, conv: 0.0169, alunos: 85,               cpl: 12, pctMql: 0.90 },
  },
  {
    funil: 'aplicacao', nome: 'Aplicacao Direta',
    meta:      { fat: 135000, inv: 30000, leads: 261, roas: 4.5, conv: 0.0609, alunos: 16, ticket: 8500, cpl: 115, pctMql: 0.90 },
    superMeta: { fat: 150000,             leads: 273, roas: 5,   conv: 0.0647, alunos: 18,               cpl: 110, pctMql: 0.95 },
    megaMeta:  { fat: 180000,             leads: 300, roas: 6,   conv: 0.0706, alunos: 21,               cpl: 100, pctMql: 0.98 },
  },
];

// ─── Projeção Anual (METAS tab top) ─────────────────────────────────────────

export const PROJECAO_ANUAL = [
  { mes: 'Jan/26', totalVendas: 2105000,  novasVendas: 255, inv: 191250,  roas: 11 },
  { mes: 'Fev/26', totalVendas: 1840000,  novasVendas: 230, inv: 172500,  roas: 10.7 },
  { mes: 'Mar/26', totalVendas: 1487500,  novasVendas: 205, inv: 300000,  roas: 8.1 },
  { mes: 'Abr/26', totalVendas: 499000,   novasVendas: 74,  inv: 88800,   roas: 5.6 },
  { mes: 'Mai/26', totalVendas: 496500,   novasVendas: 83,  inv: 83000,   roas: 6 },
  { mes: 'Jun/26', totalVendas: 225000,   novasVendas: 45,  inv: 58500,   roas: 3.8 },
  { mes: 'Jul/26', totalVendas: 450000,   novasVendas: 100, inv: 80000,   roas: 5.6 },
  { mes: 'Ago/26', totalVendas: 180000,   novasVendas: 24,  inv: 22800,   roas: 7.9 },
  { mes: 'Set/26', totalVendas: 172500,   novasVendas: 23,  inv: 34500,   roas: 5 },
  { mes: 'Out/26', totalVendas: 972000,   novasVendas: 162, inv: 160380,  roas: 6.1 },
  { mes: 'Nov/26', totalVendas: 1859000,  novasVendas: 286, inv: 283140,  roas: 6.6 },
  { mes: 'Dez/26', totalVendas: 1291500,  novasVendas: 164, inv: 108240,  roas: 11.9 },
];

export const PROJECAO_TRAFEGO_REALIZADO = {
  jan: { projecao: 191250, realizado: 194166, pctRetorno: 104.58 },
  fev: { projecao: 172500, realizado: 186704.17, pctRetorno: 89.86 },
  mar: { projecao: 300000, realizado: 0, pctRetorno: 0 },
};

// ─── Daily Data (Acompanhamento_Mar) ────────────────────────────────────────

export const DADOS_DIARIOS: DadoDiario[] = [
  { data: '01/03', inv: 6243.73,  leads: 79,  cpl: 79.03,  mqls: 52,  cpmql: 120.07, pctMql: 0.658, sdrAgend: 9,  agendNoDia: 0,  calls: 0,  callsPorCloser: 0,    pctConv: 0,     vendas: 1,  fat: 7000,   roas: 1.121,  cpa: 6243.73 },
  { data: '02/03', inv: 5976.47,  leads: 71,  cpl: 84.18,  mqls: 47,  cpmql: 127.16, pctMql: 0.662, sdrAgend: 26, agendNoDia: 28, calls: 26, callsPorCloser: 2.89,  pctConv: 0.3462, vendas: 9,  fat: 72750,  roas: 12.173, cpa: 664.05 },
  { data: '03/03', inv: 7785.47,  leads: 63,  cpl: 123.58, mqls: 45,  cpmql: 173.01, pctMql: 0.714, sdrAgend: 15, agendNoDia: 22, calls: 16, callsPorCloser: 1.78,  pctConv: 0.6875, vendas: 11, fat: 86650,  roas: 11.130, cpa: 707.77 },
  { data: '04/03', inv: 9923.22,  leads: 97,  cpl: 102.30, mqls: 54,  cpmql: 183.76, pctMql: 0.557, sdrAgend: 11, agendNoDia: 17, calls: 15, callsPorCloser: 1.67,  pctConv: 0.5333, vendas: 8,  fat: 66150,  roas: 6.666,  cpa: 1240.40 },
  { data: '05/03', inv: 10914.64, leads: 117, cpl: 93.29,  mqls: 69,  cpmql: 158.18, pctMql: 0.590, sdrAgend: 17, agendNoDia: 14, calls: 11, callsPorCloser: 1.22,  pctConv: 0.5455, vendas: 6,  fat: 47000,  roas: 4.306,  cpa: 1819.11 },
];

export const TOTAIS: Totais = {
  inv: 40843.53,
  leads: 427,
  mqls: 267,
  pctMql: 0.6307,
  sdrAgend: 78,
  pctSdrAgend: 0.334,
  agendNoDia: 81,
  calls: 68,
  pctCalls: 0.1108,
  callsPorCloser: 0.252,
  vendas: 35,
  pctConv: 0.5147,
  fat: 279550,
  roas: 6.844,
  cpa: 1166.96,
};

// ─── Funnel Indicators (Gauges) ──────────────────────────────────────────────

export const FAROIS: Farol[] = [
  { label: '% MQL',         valor: 63.07, meta: 80,  unidade: '%', desc: 'Leads qualificados' },
  { label: '% Agend. SDR',  valor: 29.2,  meta: 60,  unidade: '%', desc: 'MQLs agendados' },
  { label: '% Show',        valor: 83.9,  meta: 70,  unidade: '%', desc: 'Reunioes realizadas' },
  { label: '% Conversao',   valor: 51.5,  meta: 30,  unidade: '%', desc: 'Calls que fecham' },
];

// ─── Funnel Data (by channel) — Março atual ─────────────────────────────────

export const FUNIS: FunilData[] = [
  { id: 'webinario',  nome: 'Webinario',        inv: 15224.19, invMeta: 135000, invPct: 0.45, invDiario: 4354.84, leads: 95,  mqls: 67,  vendas: 0,  fat: 0,       roas: 0,    cor: '#D4AF37' },
  { id: 'isca',       nome: 'Isca',             inv: 12587.93, invMeta: 60000,  invPct: 0.20, invDiario: 1935.48, leads: 213, mqls: 132, vendas: 22, fat: 187000,  roas: 14.86, cor: '#60A5FA' },
  { id: 'aplicacao',  nome: 'Aplicacao Direta', inv: 8684.62,  invMeta: 30000,  invPct: 0.10, invDiario: 967.74,  leads: 87,  mqls: 51,  vendas: 9,  fat: 63550,   roas: 7.32,  cor: '#4ADE80' },
  { id: 'ss',         nome: 'Social Selling',   inv: 4346.79,  invMeta: 75000,  invPct: 0.25, invDiario: 2419.35, leads: 32,  mqls: 17,  vendas: 4,  fat: 29000,   roas: 6.67,  cor: '#FACC15' },
];

// ─── Full Funnel Steps ───────────────────────────────────────────────────────

export const FUNIL_STEPS: FunilStep[] = [
  { label: 'INVESTIMENTO',  valor: 'R$ 40.844',   sub: 'Meta: R$ 300k',      pct: null,   area: 'marketing' },
  { label: 'LEADS',         valor: '427',          sub: 'CPL: R$ 95,65',      pct: '100%', area: 'marketing' },
  { label: 'MQL',           valor: '267',          sub: 'CPMQL: R$ 152,97',   pct: '63%',  area: 'marketing' },
  { label: 'AGEND. SDR',    valor: '78',           sub: 'Taxa: 29,2%',        pct: '29%',  area: 'comercial' },
  { label: 'CALLS',         valor: '68',           sub: 'Show rate: 83,9%',   pct: '84%',  area: 'comercial' },
  { label: 'VENDAS',        valor: '35',           sub: 'Conv: 51,5%',        pct: '51%',  area: 'comercial' },
  { label: 'FATURAMENTO',   valor: 'R$ 279.550',   sub: 'ROAS: 6,84x',       pct: null,   area: 'comercial' },
];

// ─── Conversion Table ────────────────────────────────────────────────────────

export const CONVERSOES: ConversaoEtapa[] = [
  { etapa: 'Leads → MQL',     volume: '427 → 267',  taxa: '63,1%', meta: '80%',  status: 'danger' },
  { etapa: 'MQL → Agend.',    volume: '267 → 78',   taxa: '29,2%', meta: '60%',  status: 'danger' },
  { etapa: 'Agend. → Call',   volume: '81 → 68',    taxa: '83,9%', meta: '70%',  status: 'ok' },
  { etapa: 'Call → Venda',    volume: '68 → 35',    taxa: '51,5%', meta: '30%',  status: 'ok' },
  { etapa: 'Lead → Venda',    volume: '427 → 35',   taxa: '8,2%',  meta: '—',    status: null },
];

// ─── Historical Data — Funil Isca (Jun/25 - Fev/26) ────────────────────────

export const HISTORICO_ISCA: HistoricoMes[] = [
  { mes: 'Jun/25', roas: 5.49, cpl: 7.86,  inv: 7743,   leads: 985,  mqls: 361,  pctMql: 36.65, vendas: 5,  fat: 42500 },
  { mes: 'Jul/25', roas: 4.47, cpl: 13.26, inv: 7613,   leads: 574,  mqls: 215,  pctMql: 37.46, vendas: 4,  fat: 34000 },
  { mes: 'Ago/25', roas: 3.06, cpl: 9.43,  inv: 2781,   leads: 295,  mqls: 149,  pctMql: 50.51, vendas: 1,  fat: 8500 },
  { mes: 'Set/25', roas: 0,    cpl: 8.87,  inv: 3007,   leads: 339,  mqls: 245,  pctMql: 72.27, vendas: 0,  fat: 0 },
  { mes: 'Out/25', roas: 5.07, cpl: 11.76, inv: 10066,  leads: 856,  mqls: 610,  pctMql: 71.26, vendas: 6,  fat: 51000 },
  { mes: 'Nov/25', roas: 4.52, cpl: 13.39, inv: 15038,  leads: 1123, mqls: 467,  pctMql: 41.59, vendas: 8,  fat: 68000 },
  { mes: 'Dez/25', roas: 3.61, cpl: 11.53, inv: 21216,  leads: 1840, mqls: 1289, pctMql: 70.05, vendas: 9,  fat: 76500 },
  { mes: 'Jan/26', roas: 6.67, cpl: 10.19, inv: 24226,  leads: 2377, mqls: 1028, pctMql: 43.25, vendas: 19, fat: 161500 },
  { mes: 'Fev/26', roas: 4.94, cpl: 20.11, inv: 22388,  leads: 1113, mqls: 690,  pctMql: 62.0,  vendas: 13, fat: 110500 },
];

// ─── Historical Data — Funil Aplicação Direta (Jun/25 - Fev/26) ────────────

export const HISTORICO_APLICACAO: HistoricoMes[] = [
  { mes: 'Jun/25', roas: 4.04,  cpl: 116.84, inv: 6309.41,  leads: 54,  mqls: 47,  pctMql: 87.04, vendas: 3,  fat: 25500 },
  { mes: 'Jul/25', roas: 0,     cpl: 270.47, inv: 540.93,   leads: 2,   mqls: 1,   pctMql: 50.0,  vendas: 0,  fat: 0 },
  { mes: 'Ago/25', roas: 0,     cpl: 133.96, inv: 7234,     leads: 54,  mqls: 39,  pctMql: 72.22, vendas: 0,  fat: 0 },
  { mes: 'Set/25', roas: 1.38,  cpl: 75.37,  inv: 6180,     leads: 82,  mqls: 63,  pctMql: 76.83, vendas: 1,  fat: 8500 },
  { mes: 'Out/25', roas: 0,     cpl: 0,      inv: 0,        leads: 0,   mqls: 0,   pctMql: 0,     vendas: 2,  fat: 17000 },
  { mes: 'Nov/25', roas: 0,     cpl: 0,      inv: 0,        leads: 0,   mqls: 0,   pctMql: 0,     vendas: 0,  fat: 0 },
  { mes: 'Dez/25', roas: 0,     cpl: 75.29,  inv: 11217.88, leads: 149, mqls: 149, pctMql: 100.0, vendas: 0,  fat: 0 },
  { mes: 'Jan/26', roas: 5.36,  cpl: 95.45,  inv: 23766,    leads: 249, mqls: 249, pctMql: 100.0, vendas: 15, fat: 127500 },
  { mes: 'Fev/26', roas: 0,     cpl: 124.66, inv: 23684.62, leads: 190, mqls: 153, pctMql: 80.53, vendas: 0,  fat: 0 },
];

// ─── Webinário Diário (Lançamento Webinário | Diário) ───────────────────────

export const WEBINARIO_DIARIO: WebinarioDiario[] = [
  { data: '17/02', inv: 1464.40, leads: 11, cpl: 133.13, mqls: 9,  pctMql: 0.8182, custoMql: 162.71, cpm: 14.14, ctr: 0.54 },
  { data: '18/02', inv: 1533.68, leads: 14, cpl: 109.55, mqls: 12, pctMql: 0.8571, custoMql: 127.81, cpm: 13.80, ctr: 0.48 },
  { data: '19/02', inv: 1634.24, leads: 9,  cpl: 181.58, mqls: 9,  pctMql: 1.0,    custoMql: 181.58, cpm: 13.43, ctr: 0.30 },
  { data: '20/02', inv: 2561.26, leads: 10, cpl: 256.13, mqls: 8,  pctMql: 0.80,   custoMql: 320.16, cpm: 14.75, ctr: 0.25 },
  { data: '21/02', inv: 7061.89, leads: 35, cpl: 201.77, mqls: 30, pctMql: 0.8571, custoMql: 235.40, cpm: 18.10, ctr: 0.23 },
  { data: '22/02', inv: 9832.40, leads: 50, cpl: 196.65, mqls: 42, pctMql: 0.84,   custoMql: 234.10, cpm: 19.68, ctr: 0.24 },
  { data: '23/02', inv: 8865.56, leads: 58, cpl: 152.85, mqls: 57, pctMql: 0.9828, custoMql: 155.54, cpm: 23.59, ctr: 0.23 },
  { data: '24/02', inv: 6164.28, leads: 31, cpl: 198.85, mqls: 30, pctMql: 0.9677, custoMql: 205.48, cpm: 21.35, ctr: 0.20 },
  // 25/02 e 26/02: sem dados
  { data: '27/02', inv: 1498.30, leads: 9,  cpl: 166.48, mqls: 8,  pctMql: 0.8889, custoMql: 187.29, cpm: 21.86, ctr: 0.27 },
  { data: '28/02', inv: 2041.15, leads: 9,  cpl: 226.79, mqls: 7,  pctMql: 0.7778, custoMql: 291.59, cpm: 33.16, ctr: 0.36 },
  { data: '01/03', inv: 3072.89, leads: 25, cpl: 122.92, mqls: 23, pctMql: 0.92,   custoMql: 133.60, cpm: 36.64, ctr: 0.34 },
  { data: '02/03', inv: 2560.66, leads: 20, cpl: 128.03, mqls: 20, pctMql: 1.0,    custoMql: 128.03, cpm: 30.64, ctr: 0.27 },
  { data: '03/03', inv: 4589.64, leads: 24, cpl: 191.24, mqls: 23, pctMql: 0.9583, custoMql: 199.55, cpm: 29.10, ctr: 0.41 },
  { data: '04/03', inv: 5001.03, leads: 26, cpl: 192.35, mqls: 24, pctMql: 0.9231, custoMql: 208.38, cpm: 28.77, ctr: 0.32 },
];

export const WEBINARIO_TOTAIS = {
  inv: 82150,
  invDiario: 39117.71,
  leads: 227,
  cpl: 189.12,
  mqls: 197,
  pctMql: 0.80,
  custoMql: 193.53,
  cpm: 16.43,
  ctr: 0.25,
  leadsWhatsapp: 0.30,
};

// backward compat alias
export const HISTORICO = HISTORICO_ISCA;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function fmtBRL(n: number, prefix = 'R$ '): string {
  if (n == null || isNaN(n)) return '—';
  return `${prefix}${n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
}

export function fmtK(n: number): string {
  if (n >= 1000000) return `R$ ${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `R$ ${(n / 1000).toFixed(1)}k`;
  return `R$ ${n.toFixed(0)}`;
}

export function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function cpaStatus(v: number): 'ok' | 'warn' | 'danger' {
  if (v <= 300) return 'ok';
  if (v <= 400) return 'warn';
  return 'danger';
}

export function farolColor(valor: number, meta: number): 'ok' | 'warn' | 'danger' {
  if (valor >= meta) return 'ok';
  if (valor >= meta * 0.75) return 'warn';
  return 'danger';
}

export function paceFaturamento(): number {
  return (TOTAIS.fat / DIAS_PASSADOS) * DIAS_MES;
}
