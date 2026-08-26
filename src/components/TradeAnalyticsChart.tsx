import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Zap, 
  ArrowUpRight, 
  Layers, 
  Lock,
  Activity,
  Award,
  DollarSign
} from 'lucide-react';

export interface TradeDayData {
  date: string;
  dayNumber: number;
  fullDate: string;
  tradeVolumeLakhs: number; // In ₹ Lakhs
  escrowLockedLakhs: number; // In ₹ Lakhs
  settledVolumeLakhs: number; // In ₹ Lakhs
  milestoneCompletionRate: number; // Percentage 0 - 100
  activeMilestonesCount: number;
  completedMilestonesCount: number;
  dualSigPassRate: number; // Percentage
  disputeRate: number; // Percentage (e.g. 0.0%)
}

// Generate realistic 30-day time series data for B2B industrial trade and milestone completions
const generate30DayTradeData = (): TradeDayData[] => {
  const data: TradeDayData[] = [];
  const baseDate = new Date(2026, 7, 25); // Aug 25, 2026

  // 30 days cycle
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // Pattern with realistic enterprise growth and midweek spikes
    const dayFactor = 1 + Math.sin(i * 0.4) * 0.35 + (29 - i) * 0.03;
    const weekendDampener = isWeekend ? 0.45 : 1.0;

    const baseTrade = (18 + (i % 7) * 4.5 + Math.random() * 8) * dayFactor * weekendDampener;
    const tradeVol = parseFloat(Math.max(5, baseTrade).toFixed(1));
    const escrowVol = parseFloat((tradeVol * (0.75 + Math.random() * 0.18)).toFixed(1));
    const settledVol = parseFloat((tradeVol * (0.6 + Math.random() * 0.3)).toFixed(1));

    // High milestone completion rate between 94% and 100%
    const completionRate = parseFloat((94.5 + Math.min(5.5, (30 - i) * 0.15 + (Math.random() * 2.5 - 1))).toFixed(1));
    const dualSig = parseFloat((98.0 + (Math.random() * 2.0)).toFixed(1));
    
    const activeCount = Math.floor(6 + (i % 5) * 2 + Math.random() * 4);
    const completedCount = Math.floor(activeCount * (completionRate / 100));

    data.push({
      date: dayName,
      dayNumber: 30 - i,
      fullDate: fullDateStr,
      tradeVolumeLakhs: tradeVol,
      escrowLockedLakhs: escrowVol,
      settledVolumeLakhs: settledVol,
      milestoneCompletionRate: Math.min(100, completionRate),
      activeMilestonesCount: activeCount,
      completedMilestonesCount: completedCount,
      dualSigPassRate: Math.min(100, dualSig),
      disputeRate: 0.0
    });
  }
  return data;
};

const RAW_30_DAY_DATA = generate30DayTradeData();

// Custom High-Craft Tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item: TradeDayData = payload[0]?.payload;
    if (!item) return null;

    return (
      <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl max-w-xs text-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-blue-400" />
            <span className="font-bold text-slate-200">{item.fullDate}</span>
          </div>
          <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Day {item.dayNumber} / 30
          </span>
        </div>

        <div className="space-y-2">
          {/* Trade Volume */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Total Trade Volume:
            </span>
            <span className="font-black text-blue-300 font-mono">
              ₹{item.tradeVolumeLakhs >= 100 ? `${(item.tradeVolumeLakhs / 100).toFixed(2)} Cr` : `${item.tradeVolumeLakhs} L`}
            </span>
          </div>

          {/* Escrow Locked */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              Escrow Secured:
            </span>
            <span className="font-black text-cyan-300 font-mono">
              ₹{item.escrowLockedLakhs >= 100 ? `${(item.escrowLockedLakhs / 100).toFixed(2)} Cr` : `${item.escrowLockedLakhs} L`}
            </span>
          </div>

          {/* Settled Release */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Settled Payouts:
            </span>
            <span className="font-black text-emerald-300 font-mono">
              ₹{item.settledVolumeLakhs >= 100 ? `${(item.settledVolumeLakhs / 100).toFixed(2)} Cr` : `${item.settledVolumeLakhs} L`}
            </span>
          </div>

          {/* Milestone Completion Rate */}
          <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-amber-400" />
              Milestone Completion:
            </span>
            <span className="font-black text-amber-400 font-mono text-xs">
              {item.milestoneCompletionRate}%
            </span>
          </div>

          {/* Dual Sig Status */}
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Dual-Sig Cleared:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {item.completedMilestonesCount} / {item.activeMilestonesCount} Stages (100% Zero-Default)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TradeAnalyticsChart() {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [viewMode, setViewMode] = useState<'all' | 'volume' | 'milestones'>('all');

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const count = parseInt(timeRange, 10);
    return RAW_30_DAY_DATA.slice(-count);
  }, [timeRange]);

  // Aggregate Metrics over selected range
  const stats = useMemo(() => {
    const totalVolume = filteredData.reduce((acc, d) => acc + d.tradeVolumeLakhs, 0);
    const totalEscrow = filteredData.reduce((acc, d) => acc + d.escrowLockedLakhs, 0);
    const totalSettled = filteredData.reduce((acc, d) => acc + d.settledVolumeLakhs, 0);
    const avgCompletion = filteredData.reduce((acc, d) => acc + d.milestoneCompletionRate, 0) / filteredData.length;
    const totalMilestones = filteredData.reduce((acc, d) => acc + d.completedMilestonesCount, 0);

    return {
      totalVolumeCr: (totalVolume / 100).toFixed(2),
      totalEscrowCr: (totalEscrow / 100).toFixed(2),
      totalSettledCr: (totalSettled / 100).toFixed(2),
      avgCompletionPct: avgCompletion.toFixed(1),
      totalMilestones
    };
  }, [filteredData]);

  return (
    <div className="registry-card bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Top Header & Interactive Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-survyx-blue flex items-center justify-center border border-blue-100 shadow-xs">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  30-Day B2B Trade & Milestone Velocity
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Telemetry
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.16em] mt-0.5">
                Real-time escrow liquidity, settlement throughput & dual-signature milestone completion
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Range Controllers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric View Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-[10px] font-black uppercase">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'all'
                  ? 'bg-white text-survyx-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unified View
            </button>
            <button
              onClick={() => setViewMode('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'volume'
                  ? 'bg-white text-survyx-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Volume (₹)
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'milestones'
                  ? 'bg-white text-survyx-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Milestones (%)
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-[10px] font-black uppercase">
            {(['7', '14', '30'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-survyx-navy text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-gradient-to-br from-blue-50/60 to-white rounded-2xl border border-blue-100">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Total Trade GMV ({timeRange}D)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-survyx-navy font-mono">₹{stats.totalVolumeCr}</span>
            <span className="text-[10px] font-bold text-slate-500">Cr</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight size={11} /> +18.4% MoM
          </span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-cyan-50/60 to-white rounded-2xl border border-cyan-100">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Escrow Locked Inflow
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-cyan-800 font-mono">₹{stats.totalEscrowCr}</span>
            <span className="text-[10px] font-bold text-slate-500">Cr</span>
          </div>
          <span className="text-[9px] font-bold text-cyan-600 flex items-center gap-1 mt-1">
            <Lock size={10} /> 100% Tripartite Safe
          </span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-amber-50/60 to-white rounded-2xl border border-amber-100">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Milestone Pass Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-amber-900 font-mono">{stats.avgCompletionPct}%</span>
          </div>
          <span className="text-[9px] font-bold text-amber-600 flex items-center gap-1 mt-1">
            <CheckCircle2 size={11} /> {stats.totalMilestones} Stages Cleared
          </span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl border border-emerald-100">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Settled Payouts
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-800 font-mono">₹{stats.totalSettledCr}</span>
            <span className="text-[10px] font-bold text-slate-500">Cr</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <ShieldCheck size={11} /> 0.0% Default Rate
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Area */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Blue Gradient for Trade Volume Area */}
              <linearGradient id="tradeVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>

              {/* Cyan Gradient for Escrow Locked Bar */}
              <linearGradient id="escrowBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Emerald Gradient for Settled Release */}
              <linearGradient id="settledGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

            {/* Primary X-Axis */}
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
              interval={timeRange === '30' ? 3 : timeRange === '14' ? 1 : 0}
            />

            {/* Left Y-Axis: Volume in ₹ Lakhs */}
            <YAxis
              yAxisId="volume"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(v) => `₹${v}L`}
              domain={[0, 'auto']}
            />

            {/* Right Y-Axis: Milestone Completion Rate % */}
            <YAxis
              yAxisId="rate"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#D97706', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(v) => `${v}%`}
              domain={[85, 102]}
            />

            <Tooltip content={<CustomChartTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 700 }}
            />

            {/* Benchmark 95% SLA Target Line */}
            {(viewMode === 'all' || viewMode === 'milestones') && (
              <ReferenceLine 
                yAxisId="rate" 
                y={95} 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  value: '95% SLA Benchmark', 
                  fill: '#D97706', 
                  fontSize: 9, 
                  fontWeight: 800,
                  position: 'insideTopRight'
                }} 
              />
            )}

            {/* 1. B2B Trade Volume Area (Lakhs) */}
            {(viewMode === 'all' || viewMode === 'volume') && (
              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="tradeVolumeLakhs"
                name="B2B Trade Volume (₹L)"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tradeVolumeGrad)"
              />
            )}

            {/* 2. Escrow Secured Locked Inflow (Bars) */}
            {(viewMode === 'all' || viewMode === 'volume') && (
              <Bar
                yAxisId="volume"
                dataKey="escrowLockedLakhs"
                name="Escrow Locked (₹L)"
                fill="url(#escrowBarGrad)"
                radius={[4, 4, 0, 0]}
                barSize={timeRange === '30' ? 7 : 14}
              />
            )}

            {/* 3. Settled Milestone Payouts (Line) */}
            {(viewMode === 'all' || viewMode === 'volume') && (
              <Line
                yAxisId="volume"
                type="monotone"
                dataKey="settledVolumeLakhs"
                name="Settled Payouts (₹L)"
                stroke="#10B981"
                strokeWidth={2}
                dot={timeRange === '7'}
                activeDot={{ r: 5 }}
              />
            )}

            {/* 4. Milestone Completion Rate (Line with Amber glow) */}
            {(viewMode === 'all' || viewMode === 'milestones') && (
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="milestoneCompletionRate"
                name="Milestone Completion (%)"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', r: timeRange === '7' ? 4 : 2 }}
                activeDot={{ r: 6, fill: '#D97706', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Institutional Protocol Legend */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-slate-500">
        <div className="flex flex-wrap items-center gap-4 font-bold">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            Gross Trade GMV
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
            Escrow Locked Inflow
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Milestone Completion Rate (%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Settled Outflow
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>NPCI e-NACH / RTGS Tripartite Audited</span>
        </div>
      </div>
    </div>
  );
}
