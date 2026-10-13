import React, { useState } from 'react';
import { 
  ThemeTokens 
} from '../types/theme';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal, 
  Filter, 
  Plus, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface DashboardPreviewProps {
  tokens: ThemeTokens;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ tokens }) => {
  const [selectedFilter, setSelectedFilter] = useState<'alla' | 'aktiva' | 'klara'>('alla');

  const stats = [
    {
      title: 'Månatlig Intäkt (MRR)',
      value: '248,500 kr',
      change: '+18.4%',
      isPositive: true,
      icon: CreditCard,
      color: tokens.primary,
    },
    {
      title: 'Aktiva Användare',
      value: '14,290',
      change: '+12.1%',
      isPositive: true,
      icon: Users,
      color: tokens.secondary,
    },
    {
      title: 'Genomsnittlig Laddtid',
      value: '124 ms',
      change: '-24%',
      isPositive: true,
      icon: Activity,
      color: tokens.accent,
    },
    {
      title: 'Konvertering',
      value: '4.82%',
      change: '+0.6%',
      isPositive: true,
      icon: TrendingUp,
      color: tokens.primary,
    },
  ];

  const projects = [
    {
      name: 'Vite 8 Migration & Tailwind v4',
      client: 'Nordic SaaS Labs',
      budget: '45,000 kr',
      status: 'Aktiv',
      progress: 85,
      date: 'Idag, 14:30',
      tagColor: tokens.primary,
    },
    {
      name: 'Next.js App Router Omnichannel',
      client: 'Stockholm Studio',
      budget: '92,000 kr',
      status: 'Klar',
      progress: 100,
      date: 'Igår, 09:15',
      tagColor: tokens.secondary,
    },
    {
      name: 'Design System Tokens & AI Rules',
      client: 'Kvantum Tech',
      budget: '28,000 kr',
      status: 'Granskas',
      progress: 60,
      date: '12 Okt, 16:45',
      tagColor: tokens.accent,
    },
  ];

  return (
    <div 
      className="p-6 md:p-8 rounded-2xl min-h-full space-y-7 transition-colors duration-200"
      style={{
        backgroundColor: tokens.background,
        color: tokens.text,
      }}
    >
      {/* Dashboard Top Header */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
        }}
      >
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight" style={{ color: tokens.text }}>
            Översikt & Analys
          </h2>
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Realtidsdata för produktionsapplikationen
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tokens.textMuted }} />
            <input
              type="text"
              placeholder="Filtrera projekt..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: tokens.background,
                borderColor: tokens.surfaceBorder,
                color: tokens.text,
                borderRadius: `${tokens.radius}px`,
              }}
            />
          </div>

          <button 
            className="p-2 rounded-lg border relative hover:opacity-85"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.surfaceBorder,
              color: tokens.text,
              borderRadius: `${tokens.radius}px`,
            }}
          >
            <Bell className="w-4 h-4" />
            <span 
              className="w-2 h-2 rounded-full absolute top-1.5 right-1.5"
              style={{ backgroundColor: tokens.accent }} 
            />
          </button>

          <button
            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryForeground,
              borderRadius: `${tokens.radius}px`,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nytt Projekt</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.surfaceBorder,
              borderRadius: `${tokens.radius}px`,
              borderWidth: `${tokens.borderWidth}px`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: tokens.textMuted }}>
                {stat.title}
              </span>
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold tracking-tight" style={{ color: tokens.text }}>
                {stat.value}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <span className="flex items-center" style={{ color: tokens.primary }}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
                <span style={{ color: tokens.textMuted }}>jämfört med föregående månad</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Data Table Card */}
      <div 
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.surfaceBorder,
          borderRadius: `${tokens.radius}px`,
          borderWidth: `${tokens.borderWidth}px`,
        }}
      >
        {/* Table Header controls */}
        <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: tokens.surfaceBorder }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: tokens.text }}>
              Pågående Leveranser
            </h3>
            <p className="text-xs" style={{ color: tokens.textMuted }}>
              Övervakning av byggstatus och deadlines
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg border text-xs" style={{ borderColor: tokens.surfaceBorder, backgroundColor: tokens.background }}>
            {(['alla', 'aktiva', 'klara'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className="px-2.5 py-1 rounded font-medium capitalize transition-all cursor-pointer"
                style={{
                  backgroundColor: selectedFilter === filter ? tokens.primary : 'transparent',
                  color: selectedFilter === filter ? tokens.primaryForeground : tokens.textMuted,
                  borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table items */}
        <div className="divide-y overflow-x-auto" style={{ borderColor: tokens.surfaceBorder }}>
          {projects.map((proj, idx) => (
            <div 
              key={idx} 
              className="p-4 flex items-center justify-between gap-4 text-xs hover:opacity-95 transition-opacity"
              style={{ backgroundColor: `${tokens.surface}` }}
            >
              <div className="space-y-1 min-w-[180px]">
                <div className="font-semibold text-sm" style={{ color: tokens.text }}>
                  {proj.name}
                </div>
                <div className="flex items-center gap-2" style={{ color: tokens.textMuted }}>
                  <span>{proj.client}</span>
                  <span>·</span>
                  <span>{proj.date}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="hidden md:block w-36 space-y-1">
                <div className="flex justify-between text-[10px]" style={{ color: tokens.textMuted }}>
                  <span>Status</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${tokens.surfaceBorder}` }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${proj.progress}%`,
                      backgroundColor: proj.tagColor,
                    }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="font-mono font-medium text-right" style={{ color: tokens.text }}>
                {proj.budget}
              </div>

              {/* Status Badge */}
              <div 
                className="px-2.5 py-1 rounded font-semibold text-[11px] shrink-0"
                style={{
                  backgroundColor: `${proj.tagColor}20`,
                  color: proj.tagColor,
                  borderRadius: `${Math.max(4, tokens.radius - 4)}px`,
                }}
              >
                {proj.status}
              </div>

              {/* Actions */}
              <button 
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                style={{ color: tokens.textMuted }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
