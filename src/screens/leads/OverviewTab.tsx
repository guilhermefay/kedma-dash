import React from 'react';
import { cn } from '../../lib/utils';
import {
  FAROIS, TOTAIS, META_MES, DIAS_PASSADOS, DIAS_MES,
  FUNIS, DADOS_DIARIOS,
  fmtBRL, fmtK, farolColor, paceFaturamento,
  type Farol,
} from '../../data/kedmaData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════════════════════
   GAUGE — Large semicircular indicator (inspired by ref)
   ═══════════════════════════════════════════════════════════════════════════ */

function Gauge({ label, valor, meta, unidade, desc }: Farol) {
  const status = farolColor(valor, meta);
  const ratio = Math.min(valor / meta, 1);
  const r = 56;
  const cx = 68;
  const cy = 64;
  const halfCirc = Math.PI * r;
  const offset = halfCirc * (1 - ratio);

  const colors = { ok: '#4ADE80', warn: '#FACC15', danger: '#F87171' };
  const glows = {
    ok: 'drop-shadow(0 0 12px rgba(74,222,128,0.35))',
    warn: 'drop-shadow(0 0 12px rgba(250,204,21,0.35))',
    danger: 'drop-shadow(0 0 12px rgba(248,113,113,0.35))',
  };
  const c = colors[status];

  return (
    <div className="dash-gauge p-4 md:p-5 flex flex-col items-center flex-1 min-w-[155px]">
      <svg width={136} height={82} viewBox="0 0 136 88" className="overflow-visible">
        {/* Track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="var(--bg-tertiary)" strokeWidth={11} strokeLinecap="round" />
        {/* 0% and meta markers */}
        <text x={cx - r - 2} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={8} opacity={0.5}>0%</text>
        <text x={cx + r + 2} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={8} opacity={0.5}>100%</text>
        {/* Meta tick mark */}
        {(() => {
          const metaRatio = Math.min(meta / 100, 1);
          const angle = Math.PI * (1 - metaRatio);
          const tx = cx + r * Math.cos(angle) * -1;
          const ty = cy - r * Math.sin(angle);
          return <circle cx={tx} cy={ty} r={2} fill="var(--text-muted)" opacity={0.4} />;
        })()}
        {/* Filled arc */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={c} strokeWidth={11} strokeLinecap="round"
          strokeDasharray={halfCirc} strokeDashoffset={offset}
          style={{ filter: glows[status], transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)' }}
        />
        {/* Value */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill={c}
          fontSize={26} fontWeight={800} fontFamily="'DM Sans'">
          {valor.toFixed(1)}{unidade}
        </text>
        {/* Meta label */}
        <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--text-muted)"
          fontSize={9} fontFamily="'DM Sans'" opacity={0.5}>
          meta {meta}{unidade}
        </text>
      </svg>
      <p className="text-[11px] font-extrabold text-text-secondary uppercase tracking-[1.5px] text-center mt-1">{label}</p>
      <p className="text-[9px] text-text-muted text-center mt-0.5">{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FUNNEL SECTION — 3D SVG Conical Funnel + Data Panels
   ═══════════════════════════════════════════════════════════════════════════ */

interface FunnelSectionData {
  id: string;
  label: string;
  color: string;
  colorDark: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
  taperTop: number; // % width at top
  taperBot: number; // % width at bottom
}

const FUNNEL_SECTIONS: FunnelSectionData[] = [
  {
    id: 'anuncios',
    label: 'ANUNCIOS',
    color: '#D4AF37',
    colorDark: '#A08620',
    taperTop: 100,
    taperBot: 80,
    metrics: [
      { label: 'Investimento', value: fmtBRL(TOTAIS.inv), highlight: true },
      { label: 'CPL Medio', value: fmtBRL(TOTAIS.inv / TOTAIS.leads) },
      { label: 'Meta Inv.', value: fmtK(META_MES.investimento) },
      { label: '% Budget', value: `${((TOTAIS.inv / META_MES.investimento) * 100).toFixed(1)}%` },
    ],
  },
  {
    id: 'aplicacao',
    label: 'APLICACAO',
    color: '#60A5FA',
    colorDark: '#3B82F6',
    taperTop: 80,
    taperBot: 56,
    metrics: [
      { label: 'Leads', value: String(TOTAIS.leads), highlight: true },
      { label: 'MQL', value: String(TOTAIS.mqls), highlight: true },
      { label: '% MQL', value: `${(TOTAIS.pctMql * 100).toFixed(1)}%` },
      { label: 'CPMQL', value: fmtBRL(TOTAIS.inv / TOTAIS.mqls) },
    ],
  },
  {
    id: 'pipeline',
    label: 'PIPELINE',
    color: '#F97316',
    colorDark: '#C2410C',
    taperTop: 56,
    taperBot: 36,
    metrics: [
      { label: 'Agend. SDR', value: String(TOTAIS.sdrAgend), highlight: true },
      { label: 'Calls Realizadas', value: String(TOTAIS.calls), highlight: true },
      { label: 'Show Rate', value: '87,2%' },
      { label: 'No Show', value: String(TOTAIS.sdrAgend - TOTAIS.calls) },
    ],
  },
  {
    id: 'comercial',
    label: 'COMERCIAL',
    color: '#22C55E',
    colorDark: '#15803D',
    taperTop: 36,
    taperBot: 20,
    metrics: [
      { label: 'Conversoes', value: String(TOTAIS.vendas), highlight: true },
      { label: 'Faturamento', value: fmtK(TOTAIS.fat), highlight: true },
      { label: 'ROAS', value: `${TOTAIS.roas.toFixed(2)}x` },
      { label: 'CPA', value: fmtBRL(TOTAIS.cpa) },
    ],
  },
];

/* ── Minimal 3D Funnel — muted gold tones ── */

// Muted gold palette for the funnel body (top to bottom, progressively darker)
const FUNNEL_FILLS = [
  { base: '#C4A44A', dark: '#8A7530' },
  { base: '#A8903E', dark: '#746432' },
  { base: '#8C7C36', dark: '#5E5428' },
  { base: '#70682E', dark: '#48441E' },
];

function SVGFunnel3D() {
  const W = 280;
  const H = 400;
  const cx = W / 2;
  const sections = FUNNEL_SECTIONS;
  const gap = 4; // pixel gap between sections
  const totalGaps = gap * (sections.length - 1);
  const sectionH = (H - totalGaps) / sections.length;
  const ery = 0.15; // ellipse y-ratio for 3D depth

  function getR(index: number, pos: 'top' | 'bot') {
    const pct = pos === 'top' ? sections[index].taperTop : sections[index].taperBot;
    return (pct / 100) * (W / 2) * 0.88;
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H + 20}`} className="overflow-visible">
      <defs>
        {/* Single specular highlight — shared across all sections */}
        <linearGradient id="fSpec" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="12%" stopColor="white" stopOpacity={0.14} />
          <stop offset="30%" stopColor="white" stopOpacity={0.04} />
          <stop offset="55%" stopColor="white" stopOpacity={0} />
        </linearGradient>
        {/* Per-section body gradient */}
        {FUNNEL_FILLS.map((f, i) => (
          <linearGradient key={i} id={`fB${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={f.dark} stopOpacity={0.7} />
            <stop offset="20%" stopColor={f.base} stopOpacity={0.9} />
            <stop offset="50%" stopColor={f.base} stopOpacity={0.95} />
            <stop offset="80%" stopColor={f.base} stopOpacity={0.85} />
            <stop offset="100%" stopColor={f.dark} stopOpacity={0.55} />
          </linearGradient>
        ))}
        {/* Shadow at bottom */}
        <radialGradient id="fSh" cx="50%" cy="50%">
          <stop offset="0%" stopColor="black" stopOpacity={0.2} />
          <stop offset="100%" stopColor="black" stopOpacity={0} />
        </radialGradient>
        {/* Text legibility */}
        <filter id="fTx" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="black" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={cx} cy={H + 8} rx={getR(3, 'bot') * 1.2} ry={8} fill="url(#fSh)" />

      {/* Sections — bottom to top for correct overlap */}
      {[...sections].reverse().map((s, ri) => {
        const i = sections.length - 1 - ri;
        const yTop = i * (sectionH + gap);
        const yBot = yTop + sectionH;
        const rT = getR(i, 'top');
        const rB = getR(i, 'bot');
        const eyT = rT * ery;
        const eyB = rB * ery;
        const isFirst = i === 0;

        const body = `M ${cx - rT} ${yTop} A ${rT} ${eyT} 0 0 1 ${cx + rT} ${yTop} L ${cx + rB} ${yBot} A ${rB} ${eyB} 0 0 1 ${cx - rB} ${yBot} Z`;

        return (
          <g key={s.id}>
            {/* Body fill */}
            <path d={body} fill={`url(#fB${i})`} />
            {/* Specular */}
            <path d={body} fill="url(#fSpec)" />

            {/* Top rim (first section only) */}
            {isFirst && (
              <>
                <ellipse cx={cx} cy={yTop} rx={rT} ry={eyT}
                  fill={FUNNEL_FILLS[0].base} fillOpacity={0.7}
                  stroke="white" strokeWidth={0.6} strokeOpacity={0.1} />
                <ellipse cx={cx} cy={yTop} rx={rT * 0.82} ry={eyT * 0.65}
                  fill="var(--bg-primary)" opacity={0.5} />
              </>
            )}

            {/* Bottom rim — separator between sections */}
            <ellipse cx={cx} cy={yBot} rx={rB} ry={eyB}
              fill={FUNNEL_FILLS[i].dark} fillOpacity={0.6} />

            {/* Section label */}
            <text x={cx} y={(yTop + yBot) / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fill="white" fillOpacity={0.9} fontSize={11} fontWeight={700}
              fontFamily="'DM Sans'" letterSpacing="2.5"
              filter="url(#fTx)">
              {s.label}
            </text>

            {/* Accent dot — subtle color identity */}
            <circle cx={cx} cy={yBot - 8} r={3}
              fill={s.color} opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
}

function FunnelDataPanel({ section }: { section: FunnelSectionData }) {
  const { color, metrics } = section;
  return (
    <div
      className="flex-1 min-h-[80px] rounded-xl p-3 md:p-4 flex items-center transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${color} 6%, var(--bg-card)), color-mix(in srgb, ${color} 2%, var(--bg-primary)))`,
        border: `1px solid color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-bold uppercase tracking-[2px] text-text-muted">{section.label}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider">{m.label}</p>
              <p className={cn(
                'text-[16px] md:text-[20px] font-extrabold',
                m.highlight ? 'text-text-primary' : 'text-text-secondary'
              )}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DAILY MINI CHART
   ═══════════════════════════════════════════════════════════════════════════ */

const dailyChartData = DADOS_DIARIOS.map((d) => ({
  name: d.data,
  inv: d.inv,
  fat: d.fat,
}));

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB — THE COMMAND CENTER
   ═══════════════════════════════════════════════════════════════════════════ */

export function OverviewTab() {
  const pace = paceFaturamento();
  const paceOk = pace >= META_MES.faturamento * 0.8;

  return (
    <div className="space-y-8 md:space-y-10 animate-in">

      {/* ═══════ 1. GAUGES — Saude do Funil ═══════ */}
      <section>
        <SectionHeader title="Indicadores de Funil" accent="gold" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 stagger-in">
          {FAROIS.map((f) => <Gauge key={f.label} {...f} />)}
        </div>
      </section>

      {/* ═══════ 2. THE FUNNEL — Heart of the dashboard ═══════ */}
      <section>
        <SectionHeader title="Funil de Performance" subtitle="Visao completa: investimento ao faturamento" accent="info" />

        {/* Desktop: 3D funnel left, data panels right */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr] gap-5">
          {/* 3D Funnel column */}
          <div className="dash-card p-5 pb-8 relative" style={{ minHeight: 440 }}>
            <SVGFunnel3D />
          </div>
          {/* Data panels column */}
          <div className="flex flex-col gap-3">
            {FUNNEL_SECTIONS.map((s) => (
              <FunnelDataPanel key={s.id} section={s} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: stacked cards with funnel color accent */}
        <div className="lg:hidden space-y-3">
          {FUNNEL_SECTIONS.map((s) => (
            <div key={s.id} className="dash-card overflow-visible" style={{ borderLeftWidth: 3, borderLeftColor: s.color }}>
              <div className="p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[2px] mb-3" style={{ color: s.color }}>
                  {s.label.replace('\n', ' ')}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {s.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">{m.label}</p>
                      <p className={cn('text-[18px] font-extrabold', m.highlight ? 'text-text-primary' : 'text-text-secondary')}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. HERO KPIs — Resultado do Mes ═══════ */}
      <section>
        <SectionHeader title="Resultado do Mes" subtitle={`Dia ${DIAS_PASSADOS} de ${DIAS_MES} · Pace: ${fmtK(pace)}`} accent="success" />

        <div className="dash-hero p-6 md:p-8">
          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              <HeroMetric label="Faturamento" value={fmtK(TOTAIS.fat)} accent="text-gold-shimmer" />
              <HeroMetric label="Investimento" value={fmtK(TOTAIS.inv)} />
              <HeroMetric label="ROAS" value={`${TOTAIS.roas.toFixed(1)}x`} accent={TOTAIS.roas >= META_MES.roas ? 'text-success' : 'text-warning'} />
              <HeroMetric label="Vendas" value={String(TOTAIS.vendas)} />
              <HeroMetric label="CPA" value={fmtBRL(TOTAIS.cpa)} accent="text-danger" />
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-5 border-t border-border/20">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Meta Faturamento</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-text-secondary">
                    {fmtK(TOTAIS.fat)} / {fmtK(META_MES.faturamento)}
                  </span>
                  <div className={cn('flex items-center gap-1 text-[10px] font-bold', paceOk ? 'text-success' : 'text-danger')}>
                    {paceOk ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {((TOTAIS.fat / META_MES.faturamento) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gold-gradient animate-fill"
                  style={{ width: `${Math.min((TOTAIS.fat / META_MES.faturamento) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4. DAILY PULSE ═══════ */}
      <section>
        <SectionHeader title="Pulso Diario" subtitle="Investimento vs Faturamento — Março" accent="warn" />
        <div className="dash-card p-4 md:p-6">
          <div className="h-[180px] md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barGap={4}>
                <defs>
                  <linearGradient id="gInvO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="gFatO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)', boxShadow: 'var(--shadow-elevated)' }}
                  formatter={(value: number) => [fmtBRL(value), '']}
                  cursor={{ fill: 'rgba(212,175,55,0.04)' }}
                />
                <Bar dataKey="inv" name="Investimento" fill="url(#gInvO)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="fat" name="Faturamento" fill="url(#gFatO)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-3 pt-3 border-t border-border/20">
            <ChartLegend color="var(--gold)" label="Investimento" />
            <ChartLegend color="var(--success)" label="Faturamento" />
          </div>
        </div>
      </section>

      {/* ═══════ 5. PER-FUNNEL BREAKDOWN ═══════ */}
      <section>
        <SectionHeader title="Por Canal de Aquisicao" accent="info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 stagger-in">
          {FUNIS.map((f) => {
            const pctInv = Math.min(f.inv / f.invMeta, 1);
            return (
              <div key={f.id} className="dash-card p-5" style={{ borderTopWidth: 2, borderTopColor: f.cor }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-extrabold text-text-primary uppercase tracking-wider">{f.nome}</p>
                  <span className="text-[10px] font-mono text-text-muted">{(pctInv * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden mb-4">
                  <div className="h-full rounded-full animate-fill" style={{ width: `${pctInv * 100}%`, backgroundColor: f.cor }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Invest.', fmtK(f.inv)],
                    ['Leads', f.leads > 0 ? String(f.leads) : '—'],
                    ['Vendas', f.vendas > 0 ? String(f.vendas) : '—'],
                    ['ROAS', f.roas > 0 ? `${f.roas.toFixed(1)}x` : '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9px] text-text-muted uppercase tracking-wide">{k}</p>
                      <p className="text-[16px] font-extrabold text-text-primary">{v}</p>
                    </div>
                  ))}
                </div>
                {f.fat > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border/30 flex justify-between items-baseline">
                    <span className="text-[9px] text-text-muted uppercase">Fat.</span>
                    <span className="text-[16px] font-extrabold text-success">{fmtK(f.fat)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ 6. SECONDARY KPIS ═══════ */}
      <section>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 stagger-in">
          {[
            ['CPL', fmtBRL(TOTAIS.inv / TOTAIS.leads)],
            ['CPMQL', fmtBRL(TOTAIS.inv / TOTAIS.mqls)],
            ['Tx MQL', `${(TOTAIS.pctMql * 100).toFixed(1)}%`],
            ['Show Rate', '87,2%'],
            ['Tx Conv.', '51,5%'],
            ['Lead→Venda', '8,2%'],
          ].map(([label, value]) => (
            <div key={label} className="dash-card p-3 text-center">
              <p className="text-[8px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
              <p className="text-[14px] font-extrabold text-text-primary">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroMetric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[1.5px] mb-1">{label}</p>
      <p className={cn('text-[28px] md:text-[36px] font-extrabold leading-none tracking-tight', accent || 'text-text-primary')}>
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title, subtitle, accent }: {
  title: string; subtitle?: string; accent?: 'gold' | 'info' | 'success' | 'warn';
}) {
  const bg = accent === 'gold' ? 'bg-gold' : accent === 'info' ? 'bg-info' : accent === 'success' ? 'bg-success' : 'bg-warning';
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={cn('w-1 h-6 rounded-full', bg)} />
      <div>
        <h3 className="text-[13px] font-extrabold text-text-primary uppercase tracking-[1.5px]">{title}</h3>
        {subtitle && <p className="text-[10px] text-text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ChartLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-text-muted">{label}</span>
    </div>
  );
}
