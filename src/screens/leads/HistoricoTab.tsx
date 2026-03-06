import { cn } from '../../lib/utils';
import { HISTORICO, fmtBRL, fmtK } from '../../data/kedmaData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area,
} from 'recharts';

// ─── Chart data ──────────────────────────────────────────────────────────────

const roasData = HISTORICO.map((d) => ({
  name: d.mes.split('/')[0],
  full: d.mes,
  roas: d.roas,
}));

const invData = HISTORICO.map((d) => ({
  name: d.mes.split('/')[0],
  inv: d.inv / 1000,
  fat: (d.fat || 0) / 1000,
}));

// ─── Stats ───────────────────────────────────────────────────────────────────

const totalInv = HISTORICO.reduce((s, d) => s + d.inv, 0);
const totalFat = HISTORICO.reduce((s, d) => s + (d.fat || 0), 0);
const totalVendas = HISTORICO.reduce((s, d) => s + (d.vendas || 0), 0);
const avgRoas = totalFat / totalInv;
const bestMonth = HISTORICO.reduce((a, b) => a.roas > b.roas ? a : b);

// ─── Historico Tab ───────────────────────────────────────────────────────────

export function HistoricoTab() {
  return (
    <div className="space-y-8 animate-in">

      {/* ═══════ HISTORICAL SUMMARY ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-gold" />
          <div>
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Visao Historica · Funil Isca</h3>
            <p className="text-[10px] text-text-muted mt-0.5">9 meses de dados consolidados (Jun/25 - Fev/26)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-in">
          <div className="dash-card p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Total Investido</p>
            <p className="text-2xl font-extrabold text-text-primary">{fmtK(totalInv)}</p>
            <p className="text-[10px] text-text-muted mt-1">9 meses · Funil Isca</p>
          </div>
          <div className="dash-card p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Total Faturado</p>
            <p className="text-2xl font-extrabold text-success">{fmtK(totalFat)}</p>
            <p className="text-[10px] text-text-muted mt-1">{totalVendas} vendas acumuladas</p>
          </div>
          <div className="dash-card p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">ROAS Medio</p>
            <p className="text-2xl font-extrabold text-gold">{avgRoas.toFixed(2)}x</p>
            <p className="text-[10px] text-text-muted mt-1">Retorno medio por real investido</p>
          </div>
          <div className="dash-card p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Melhor Mes</p>
            <p className="text-2xl font-extrabold text-warning">{bestMonth.mes}</p>
            <p className="text-[10px] text-text-muted mt-1">ROAS {bestMonth.roas.toFixed(2)}x · {bestMonth.vendas} vendas</p>
          </div>
        </div>
      </section>

      {/* ═══════ ROAS CHART ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-warning" />
          <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">ROAS por Mes</h3>
        </div>

        <div className="dash-card p-5 md:p-6">
          <div className="h-[220px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roasData} margin={{ top: 20, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradRoas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradRoasDim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity={0.2} />
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
                  tickFormatter={(v: number) => `${v}x`}
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
                  formatter={(value: number) => [`${value.toFixed(2)}x`, 'ROAS']}
                  labelFormatter={(label: string) => {
                    const item = roasData.find((d) => d.name === label);
                    return item?.full || label;
                  }}
                  cursor={{ fill: 'rgba(212,175,55,0.04)' }}
                />
                <Bar dataKey="roas" radius={[8, 8, 0, 0]} maxBarSize={44}>
                  {roasData.map((_, i) => {
                    const isLast = i === roasData.length - 1;
                    return <Cell key={i} fill={isLast ? 'url(#gradRoas)' : 'url(#gradRoasDim)'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ═══════ INVESTMENT TREND ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-info" />
          <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Evolucao Investimento vs Faturamento</h3>
        </div>

        <div className="dash-card p-5 md:p-6">
          <div className="h-[200px] md:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={invData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradInvArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradFatArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-elevated)',
                  }}
                  formatter={(value: number, name: string) => [`R$ ${value.toFixed(1)}k`, name === 'inv' ? 'Investimento' : 'Faturamento']}
                />
                <Area type="monotone" dataKey="inv" stroke="var(--gold)" fill="url(#gradInvArea)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--gold)' }} />
                <Area type="monotone" dataKey="fat" stroke="var(--success)" fill="url(#gradFatArea)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--success)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gold" />
              <span className="text-[11px] text-text-muted">Investimento (k)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-[11px] text-text-muted">Faturamento (k)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HISTORICAL TABLE ═══════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-success" />
          <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Tabela Consolidada</h3>
        </div>

        <div className="dash-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dash-table min-w-[750px]">
              <thead>
                <tr>
                  {['Periodo', 'Investimento', 'Leads', 'CPL', 'MQLs', '% MQL', 'Vendas', 'Faturamento', 'ROAS'].map((h, i) => (
                    <th key={h} className={i === 0 ? 'text-left' : 'text-right'}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORICO.map((d) => {
                  const pctMqlS = (d.pctMql || 0) >= 80 ? 'ok' : (d.pctMql || 0) >= 60 ? 'warn' : 'danger';
                  const roasS = d.roas >= 5 ? 'ok' : d.roas >= 3 ? 'warn' : 'danger';
                  const sCls: Record<string, string> = { ok: 'text-success', warn: 'text-warning', danger: 'text-danger' };

                  return (
                    <tr key={d.mes}>
                      <td className="text-text-secondary font-semibold">{d.mes}</td>
                      <td className="text-right font-mono">{fmtBRL(d.inv)}</td>
                      <td className="text-right font-mono">{(d.leads || 0).toLocaleString('pt-BR')}</td>
                      <td className="text-right font-mono text-text-muted">{fmtBRL(d.cpl)}</td>
                      <td className="text-right font-mono">{(d.mqls || 0).toLocaleString('pt-BR')}</td>
                      <td className={cn('text-right font-mono font-bold', sCls[pctMqlS])}>{(d.pctMql || 0).toFixed(1)}%</td>
                      <td className="text-right font-mono font-bold">{d.vendas || 0}</td>
                      <td className="text-right font-mono">{fmtBRL(d.fat || 0)}</td>
                      <td className={cn('text-right font-mono font-bold', sCls[roasS])}>{d.roas.toFixed(2)}x</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
