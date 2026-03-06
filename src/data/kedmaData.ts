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
  calls: number;
  vendas: number;
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
  calls: number;
  vendas: number;
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

// ─── Daily Data ──────────────────────────────────────────────────────────────

export const DADOS_DIARIOS: DadoDiario[] = [
  { data: '01/03', inv: 6243.73,  leads: 79,  cpl: 79.03,  mqls: 52,  cpmql: 120.07, pctMql: 0.658, sdrAgend: 9,  calls: 0,  vendas: 1,  fat: 7000,   roas: 1.12,  cpa: 6243.73 },
  { data: '02/03', inv: 5976.47,  leads: 71,  cpl: 84.18,  mqls: 47,  cpmql: 127.16, pctMql: 0.662, sdrAgend: 26, calls: 26, vendas: 9,  fat: 72750,  roas: 12.17, cpa: 664.05 },
  { data: '03/03', inv: 7785.47,  leads: 63,  cpl: 123.58, mqls: 45,  cpmql: 173.01, pctMql: 0.714, sdrAgend: 15, calls: 16, vendas: 11, fat: 86650,  roas: 11.13, cpa: 707.77 },
  { data: '04/03', inv: 9923.22,  leads: 97,  cpl: 102.30, mqls: 54,  cpmql: 183.76, pctMql: 0.557, sdrAgend: 11, calls: 15, vendas: 8,  fat: 66150,  roas: 6.67,  cpa: 1240.40 },
  { data: '05/03', inv: 10914.64, leads: 117, cpl: 93.29,  mqls: 69,  cpmql: 158.18, pctMql: 0.590, sdrAgend: 17, calls: 11, vendas: 6,  fat: 47000,  roas: 4.31,  cpa: 1819.11 },
];

export const TOTAIS: Totais = {
  inv: 40843.53,
  leads: 427,
  mqls: 267,
  pctMql: 0.6307,
  sdrAgend: 78,
  calls: 68,
  vendas: 35,
  fat: 279550,
  roas: 6.84,
  cpa: 1166.96,
};

// ─── Funnel Indicators (Gauges) ──────────────────────────────────────────────

export const FAROIS: Farol[] = [
  { label: '% MQL',         valor: 63.07, meta: 80,  unidade: '%', desc: 'Leads qualificados' },
  { label: '% Agend. SDR',  valor: 29.2,  meta: 60,  unidade: '%', desc: 'MQLs agendados' },
  { label: '% Show',        valor: 83.9,  meta: 70,  unidade: '%', desc: 'Reunioes realizadas' },
  { label: '% Conversao',   valor: 51.5,  meta: 30,  unidade: '%', desc: 'Calls que fecham' },
];

// ─── Funnel Data (by channel) ────────────────────────────────────────────────

export const FUNIS: FunilData[] = [
  { id: 'webinario',  nome: 'Webinario',         inv: 15224.19, invMeta: 135000, leads: 95,  mqls: 67,  vendas: 0,  fat: 0,       roas: 0,    cor: '#D4AF37' },
  { id: 'isca',       nome: 'Isca',              inv: 12587.93, invMeta: 60000,  leads: 213, mqls: 132, vendas: 22, fat: 187000,  roas: 14.86, cor: '#60A5FA' },
  { id: 'aplicacao',  nome: 'Aplicacao Direta',  inv: 8684.62,  invMeta: 30000,  leads: 87,  mqls: 51,  vendas: 9,  fat: 63550,   roas: 7.32,  cor: '#4ADE80' },
  { id: 'ss',         nome: 'Social Selling',    inv: 4346.79,  invMeta: 75000,  leads: 32,  mqls: 17,  vendas: 4,  fat: 29000,   roas: 6.67,  cor: '#FACC15' },
];

// ─── Full Funnel Steps ───────────────────────────────────────────────────────

export const FUNIL_STEPS: FunilStep[] = [
  { label: 'INVESTIMENTO',  valor: 'R$ 40.844',   sub: 'Meta: R$ 300k',      pct: null,   area: 'marketing' },
  { label: 'LEADS',         valor: '427',          sub: 'CPL: R$ 95,65',      pct: '100%', area: 'marketing' },
  { label: 'MQL',           valor: '267',          sub: 'CPMQL: R$ 152,97',   pct: '63%',  area: 'marketing' },
  { label: 'AGEND. SDR',    valor: '78',           sub: 'Taxa: 29,2%',        pct: '29%',  area: 'comercial' },
  { label: 'CALLS',         valor: '68',           sub: 'Show rate: 87%',     pct: '87%',  area: 'comercial' },
  { label: 'VENDAS',        valor: '35',           sub: 'Conv: 51,5%',        pct: '51%',  area: 'comercial' },
  { label: 'FATURAMENTO',   valor: 'R$ 279.550',   sub: 'ROAS: 6,84x',       pct: null,   area: 'comercial' },
];

// ─── Conversion Table ────────────────────────────────────────────────────────

export const CONVERSOES: ConversaoEtapa[] = [
  { etapa: 'Leads → MQL',     volume: '427 → 267',  taxa: '63,1%', meta: '80%',  status: 'danger' },
  { etapa: 'MQL → Agend.',    volume: '267 → 78',   taxa: '29,2%', meta: '60%',  status: 'danger' },
  { etapa: 'Agend. → Call',   volume: '78 → 68',    taxa: '87,2%', meta: '70%',  status: 'ok' },
  { etapa: 'Call → Venda',    volume: '68 → 35',    taxa: '51,5%', meta: '30%',  status: 'ok' },
  { etapa: 'Lead → Venda',    volume: '427 → 35',   taxa: '8,2%',  meta: '—',    status: null },
];

// ─── Historical Data (Funil Isca) ────────────────────────────────────────────

export const HISTORICO: HistoricoMes[] = [
  { mes: 'Jun/25', roas: 5.49, cpl: 7.86,  inv: 7743,  leads: 985,  mqls: 361, pctMql: 36.6, vendas: 5,  fat: 42500 },
  { mes: 'Jul/25', roas: 4.47, cpl: 13.26, inv: 7613,  leads: 574,  mqls: 215, pctMql: 37.5, vendas: 4,  fat: 34000 },
  { mes: 'Ago/25', roas: 3.06, cpl: 9.43,  inv: 2781,  leads: 295,  mqls: 149, pctMql: 50.5, vendas: 1,  fat: 8500 },
  { mes: 'Set/25', roas: 0,    cpl: 8.87,  inv: 3007,  leads: 339,  mqls: 245, pctMql: 72.3, vendas: 0,  fat: 0 },
  { mes: 'Out/25', roas: 5.07, cpl: 11.76, inv: 10066, leads: 856,  mqls: 610, pctMql: 71.3, vendas: 6,  fat: 51000 },
  { mes: 'Nov/25', roas: 4.52, cpl: 13.39, inv: 15038, leads: 1123, mqls: 467, pctMql: 41.6, vendas: 8,  fat: 68000 },
  { mes: 'Dez/25', roas: 3.61, cpl: 11.53, inv: 21216, leads: 1840, mqls: 1289, pctMql: 70.1, vendas: 9, fat: 76500 },
  { mes: 'Jan/26', roas: 6.67, cpl: 10.19, inv: 24226, leads: 2377, mqls: 1028, pctMql: 43.2, vendas: 19, fat: 161500 },
  { mes: 'Fev/26', roas: 4.94, cpl: 20.11, inv: 22388, leads: 1113, mqls: 690,  pctMql: 62.0, vendas: 13, fat: 110500 },
];

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
