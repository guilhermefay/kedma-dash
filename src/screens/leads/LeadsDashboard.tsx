import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { OverviewTab } from './OverviewTab';
import { DiarioTab } from './DiarioTab';
import { HistoricoTab } from './HistoricoTab';
import { MES_LABEL, DATA_ATUALIZACAO, DIAS_PASSADOS, DIAS_MES, TOTAIS, fmtK } from '../../data/kedmaData';
import {
  LayoutDashboard, CalendarDays, TrendingUp,
  Sun, Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logoSrc from '../../assets/logo.webp';

type DashTab = 'dashboard' | 'diario' | 'historico';

const TABS: { id: DashTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard',  shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'diario',    label: 'Diario',     shortLabel: 'Diario',    icon: CalendarDays },
  { id: 'historico', label: 'Historico',   shortLabel: 'Hist.',     icon: TrendingUp },
];

export function LeadsDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<DashTab>('dashboard');

  return (
    <div className="min-h-screen bg-bg-primary transition-colors duration-200 font-sans">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 0%, rgba(212,175,55,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(96,165,250,0.02) 0%, transparent 60%)' }}
      />

      {/* ── Header ── */}
      <header className="relative z-20 border-b border-border/60 backdrop-blur-xl"
        style={{ background: 'linear-gradient(180deg, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.88) 100%)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="h-16 flex items-center justify-between px-5 md:px-8">
            {/* Left */}
            <div className="flex items-center gap-4">
              <img src={logoSrc} alt="Kedma" className="h-6 md:h-7 w-auto" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-px h-7 bg-border/50" />
                <div>
                  <h1 className="text-[12px] font-extrabold text-text-primary uppercase tracking-[2px]">Marketing Dashboard</h1>
                  <p className="text-[9px] text-text-muted tracking-wider">{MES_LABEL} · Atualizado {DATA_ATUALIZACAO}</p>
                </div>
              </div>
            </div>

            {/* Center: Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-bg-tertiary/30 rounded-xl p-1 border border-border/30">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-gold-bg text-gold shadow-sm border border-gold/15'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/50'
                  )}>
                  <tab.icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-bg-tertiary/20 rounded-lg border border-border/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-text-muted">Dia <span className="text-text-secondary font-bold">{DIAS_PASSADOS}/{DIAS_MES}</span></span>
                </div>
                <div className="w-px h-3 bg-border/30" />
                <span className="text-[10px] text-text-muted">Fat: <span className="text-gold font-bold">{fmtK(TOTAIS.fat)}</span></span>
                <div className="w-px h-3 bg-border/30" />
                <span className="text-[10px] text-text-muted">ROAS: <span className="text-success font-bold">{TOTAIS.roas.toFixed(1)}x</span></span>
              </div>
              <button onClick={toggleTheme}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary/50 transition-all">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }} />
        </div>
      </header>

      {/* ── Mobile Bottom Tabs ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 backdrop-blur-xl"
        style={{ background: 'linear-gradient(180deg, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.98) 100%)' }}>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
        <div className="flex items-center justify-around py-2 px-3">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all min-w-[60px]',
                activeTab === tab.id ? 'text-gold' : 'text-text-muted')}>
              <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
              <span className="text-[9px] font-semibold tracking-wide">{tab.shortLabel}</span>
              {activeTab === tab.id && <div className="w-4 h-0.5 rounded-full bg-gold" />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
        {activeTab === 'dashboard' && <OverviewTab />}
        {activeTab === 'diario' && <DiarioTab />}
        {activeTab === 'historico' && <HistoricoTab />}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 pb-24 md:pb-8">
        <div className="dash-divider mb-4" />
        <div className="flex flex-wrap justify-between items-center">
          <span className="text-[10px] text-text-muted">KEDMA Residencia Medica · Dashboard v2.0</span>
          <span className="text-[10px] text-text-muted">Desenvolvido por Guilherme Fay</span>
        </div>
      </footer>
    </div>
  );
}
