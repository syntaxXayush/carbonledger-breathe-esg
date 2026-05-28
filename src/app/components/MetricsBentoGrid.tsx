import React from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, Clock, CheckCircle2, Zap } from 'lucide-react';
import { overviewMetrics } from '@/lib/mockData';

function formatKgCO2e(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} MtCO₂e`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)} tCO₂e`;
    return `${value.toFixed(1)} kgCO₂e`;
}

export default function MetricsBentoGrid() {
    const m = overviewMetrics;

    // Grid plan: 7 cards → grid-cols-4
    // Row 1: hero (spans 2 cols) + 2 regular = 4 cols
    // Row 2: 3 regular cards + 1 regular = 4 cols (with last spanning 1)
    // Actually 7 cards: row1 = hero(2) + 2 regular, row2 = 3 regular + 1 spanning 1 col
    // Better: row1 = hero(2) + 2 regular, row2 = 4 regular → total 6, add 1 more as row3 span-2
    // Final: 6 cards in 2 rows of 3 + hero spanning 2 = row1: hero(2)+2, row2: 2+2 = 6 cards total
    // We have exactly 6 meaningful metrics → 2 rows × 3 cols with hero spanning 2

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-5">

            {/* Hero: Total Emissions */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 card-elevated p-5 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            Total GHG Emissions (S1+S2+S3)
                        </p>
                        <p className="text-4xl font-bold font-mono-nums text-foreground tracking-tight">
                            {formatKgCO2e(m.totalAll)}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono-nums mt-1">
                            153,707 kgCO₂e
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1 text-success text-sm font-semibold">
                            <TrendingDown size={14} />
                            {Math.abs(m.yoyDelta)}% YoY
                        </span>
                        <span className="text-2xs text-muted-foreground">vs. same period 2025</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-scope1 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                            S1: <span className="text-scope1 font-mono-nums font-semibold">51.5t</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-scope2 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                            S2: <span className="text-scope2 font-mono-nums font-semibold">52.0t</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-scope3 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                            S3: <span className="text-scope3 font-mono-nums font-semibold">50.1t</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Scope 1 */}
            <div className="card-elevated p-5 border-t-2 border-t-scope1 flex flex-col justify-between min-h-[140px]">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Scope 1 — Direct
                    </p>
                    <p className="text-2xl font-bold font-mono-nums text-scope1">
                        {formatKgCO2e(m.totalScope1)}
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono-nums mt-0.5">
                        51,546.6 kgCO₂e
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <TrendingUp size={12} className="text-alert" />
                    <span className="text-2xs text-alert font-medium">+2.1% vs prior period</span>
                </div>
            </div>

            {/* Scope 2 */}
            <div className="card-elevated p-5 border-t-2 border-t-scope2 flex flex-col justify-between min-h-[140px]">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Scope 2 — Electricity
                    </p>
                    <p className="text-2xl font-bold font-mono-nums text-scope2">
                        {formatKgCO2e(m.totalScope2)}
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono-nums mt-0.5">
                        52,020.9 kgCO₂e
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <TrendingDown size={12} className="text-success" />
                    <span className="text-2xs text-success font-medium">−6.8% vs prior period</span>
                </div>
            </div>

            {/* Scope 3 */}
            <div className="card-elevated p-5 border-t-2 border-t-scope3 flex flex-col justify-between min-h-[140px]">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Scope 3 — Indirect
                    </p>
                    <p className="text-2xl font-bold font-mono-nums text-scope3">
                        {formatKgCO2e(m.totalScope3)}
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono-nums mt-0.5">
                        50,139.5 kgCO₂e
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <TrendingDown size={12} className="text-success" />
                    <span className="text-2xs text-success font-medium">−7.4% vs prior period</span>
                </div>
            </div>

            {/* Pending Review — alert state */}
            <div className="card-elevated p-5 bg-alert/5 border border-alert/20 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            Pending Review
                        </p>
                        <p className="text-3xl font-bold font-mono-nums text-alert">
                            {m.pendingCount}
                        </p>
                        <p className="text-2xs text-muted-foreground mt-0.5">records awaiting sign-off</p>
                    </div>
                    <AlertTriangle size={20} className="text-alert mt-0.5" />
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-2xs text-muted-foreground">Oldest: 3 days ago</span>
                </div>
            </div>

            {/* Anomaly Flags — warning state */}
            <div className="card-elevated p-5 bg-warning/5 border border-warning/20 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            Anomaly Flags
                        </p>
                        <p className="text-3xl font-bold font-mono-nums text-warning">
                            {m.anomalyCount}
                        </p>
                        <p className="text-2xs text-muted-foreground mt-0.5">records outside ±2σ baseline</p>
                    </div>
                    <Zap size={20} className="text-warning mt-0.5" />
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <AlertTriangle size={12} className="text-warning" />
                    <span className="text-2xs text-warning font-medium">3 at &gt;3σ — review urgently</span>
                </div>
            </div>

            {/* Ingestion success */}
            <div className="card-elevated p-5 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            Ingestion Success Rate
                        </p>
                        <p className="text-3xl font-bold font-mono-nums text-success">
                            {m.ingestionSuccessRate}%
                        </p>
                        <p className="text-2xs text-muted-foreground mt-0.5">
                            {m.duplicateRejectionCount} duplicates rejected
                        </p>
                    </div>
                    <CheckCircle2 size={20} className="text-success mt-0.5" />
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <span className="text-2xs text-muted-foreground">
                        Active jobs: <span className="text-primary font-mono-nums font-semibold">{m.activeJobs}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}