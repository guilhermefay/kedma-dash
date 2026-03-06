import { cn } from '../../lib/utils';
import {
  DADOS_DIARIOS, TOTAIS, META_MES,
  fmtBRL, cpaStatus,
} from '../../data/kedmaData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusClass: Record<string, string> = {
  ok: 'text-success', warn: 'text-warning', danger: 'text-danger',
};

function mqlStatus(pct: number): string {
  return pct >= 0.8 ? 'ok' : pct >= 0.6 ? 'warn' : 'danger';
}

function roasStatus(roas: number): string {
  return roas >= META_MES.roas ? 'ok' : roas >= 4 ? 'warn' : 'danger';
}

const chartData = DADOS_DIARIOS.map((d) => ({
  name: d.data,
  Investimento: d.inv,
  Faturamento: d.fat,
}));

// ─── Diario Tab ──────────────────────────────────────────────────────────────

export function DiarioTab() {
  // Find best and worst day
  const bestDay = DADOS_DIARIOS.reduce((a, b) => a.roas > b.roas ? a : b);
  const worstDay = DADOS_DIARIOS.reduce((a, b) => a.roas < b.roas ? a : b);

  return (
    <div className="space-y-8 animate-in">

      {/* ═══════ DAILY HIGHLIGHTS ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-gold" />
          <div>
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Destaques do Periodo</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Melhores e piores dias ate agora</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-in">
          <div className="dash-card p-5 border-t-2 border-t-success">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Melhor ROAS</p>
            <p className="text-2xl font-extrabold text-success">{bestDay.roas.toFixed(2)}x</p>
            <p className="text-[11px] text-text-muted mt-1">Dia {bestDay.data} · {bestDay.vendas} vendas · {fmtBRL(bestDay.fat)}</p>
          </div>
          <div className="dash-card p-5 border-t-2 border-t-danger">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Pior CPA</p>
            <p className="text-2xl font-extrabold text-danger">{fmtBRL(worstDay.cpa)}</p>
            <p className="text-[11px] text-text-muted mt-1">Dia {worstDay.data} · {worstDay.vendas} venda(s)</p>
          </div>
          <div className="dash-card p-5 border-t-2 border-t-gold">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Media Diaria</p>
            <p className="text-2xl font-extrabold text-gold">{fmtBRL(TOTAIS.fat / DADOS_DIARIOS.length)}</p>
            <p className="text-[11px] text-text-muted mt-1">Faturamento medio/dia · {(TOTAIS.leads / DADOS_DIARIOS.length).toFixed(0)} leads/dia</p>
          </div>
        </div>
      </section>

      {/* ═══════ CHART ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-info" />
          <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Investimento vs Faturamento</h3>
        </div>

        <div className="dash-card p-5 md:p-6">
          <div className="h-[220px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barGap={4}>
                <defs>
                  <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="gradFat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-elevated)',
                  }}
                  formatter={(value: number) => [fmtBRL(value), '']}
                  cursor={{ fill: 'rgba(212,175,55,0.04)' }}
                />
                <Bar dataKey="Investimento" fill="url(#gradInv)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Faturamento" fill="url(#gradFat)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex gap-6 mt-4 pt-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gold" />
              <span className="text-[11px] text-text-muted">Investimento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-[11px] text-text-muted">Faturamento</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DAILY TABLE ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-success" />
          <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Detalhamento Diario</h3>
        </div>

        <div className="dash-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dash-table min-w-[950px]">
              <thead>
                <tr>
                  {['Data', 'Investimento', 'Leads', 'CPL', 'MQLs', '% MQL', 'SDR Agend.', 'Calls', 'Vendas', 'Faturamento', 'ROAS', 'CPA'].map((h, i) => (
                    <th key={h} className={i === 0 ? 'text-left' : 'text-right'}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DADOS_DIARIOS.map((d) => {
                  const cs = cpaStatus(d.cpa);
                  return (
                    <tr key={d.data}>
                      <td className="text-text-secondary font-semibold">{d.data}</td>
                      <td className="text-right font-mono">{fmtBRL(d.inv)}</td>
                      <td className="text-right font-mono font-semibold">{d.leads}</td>
                      <td className="text-right font-mono text-text-muted">{fmtBRL(d.cpl)}</td>
                      <td className="text-right font-mono font-semibold">{d.mqls}</td>
                      <td className={cn('text-right font-mono font-bold', statusClass[mqlStatus(d.pctMql)])}>
                        {(d.pctMql * 100).toFixed(1)}%
                      </td>
                      <td className="text-right font-mono">{d.sdrAgend}</td>
                      <td className="text-right font-mono">{d.calls}</td>
                      <td className="text-right font-mono font-bold text-text-primary">{d.vendas}</td>
                      <td className={cn('text-right font-mono font-semibold', statusClass['ok'])}>
                        {fmtBRL(d.fat)}
                      </td>
                      <td className={cn('text-right font-mono font-bold', statusClass[roasStatus(d.roas)])}>
                        {d.roas.toFixed(2)}x
                      </td>
                      <td className={cn('text-right font-mono font-bold', statusClass[cs])}>
                        {fmtBRL(d.cpa)}
                      </td>
                    </tr>
                  );
                })}
                {/* Total */}
                <tr className="!bg-gold-bg/40 border-t-2 border-t-gold/20">
                  <td className="font-bold text-gold">TOTAL</td>
                  <td className="text-right font-mono font-bold text-gold">{fmtBRL(TOTAIS.inv)}</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.leads}</td>
                  <td className="text-right font-mono font-bold text-gold">{fmtBRL(TOTAIS.inv / TOTAIS.leads)}</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.mqls}</td>
                  <td className="text-right font-mono font-bold text-gold">{(TOTAIS.pctMql * 100).toFixed(1)}%</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.sdrAgend}</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.calls}</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.vendas}</td>
                  <td className="text-right font-mono font-bold text-gold">{fmtBRL(TOTAIS.fat)}</td>
                  <td className="text-right font-mono font-bold text-gold">{TOTAIS.roas.toFixed(2)}x</td>
                  <td className="text-right font-mono font-bold text-gold">{fmtBRL(TOTAIS.cpa)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CPA Legend */}
        <div className="flex flex-wrap gap-5 mt-3">
          {[
            ['CPA OK (< R$300)', 'text-success', 'bg-success'],
            ['Atencao (R$300-400)', 'text-warning', 'bg-warning'],
            ['Acima do limite (> R$400)', 'text-danger', 'bg-danger'],
          ].map(([label, textCls, bgCls]) => (
            <div key={label} className={cn('flex items-center gap-2 text-[11px] font-medium', textCls)}>
              <div className={cn('w-2.5 h-2.5 rounded-sm', bgCls)} />
              {label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
