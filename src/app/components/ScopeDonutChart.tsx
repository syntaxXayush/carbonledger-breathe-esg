'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { scopeBreakdownData } from '@/lib/mockData';

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];
    const total = scopeBreakdownData.reduce((s, d) => s + d.value, 0);
    const pct = ((item.value / total) * 100).toFixed(1);
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.fill }} />
                <span className="font-medium text-foreground">{item.name}</span>
            </div>
            <p className="text-muted-foreground">
                <span className="font-mono-nums font-semibold text-foreground">
                    {(item.value / 1000).toFixed(1)}t
                </span>{' '}
                kgCO₂e · {pct}%
            </p>
        </div>
    );
}

export default function ScopeDonutChart() {
    const total = scopeBreakdownData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={scopeBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {scopeBreakdownData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-bold font-mono-nums text-foreground">
                        {(total / 1000).toFixed(0)}t
                    </p>
                    <p className="text-2xs text-muted-foreground">kgCO₂e</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-2 w-full">
                {scopeBreakdownData.map((entry) => {
                    const pct = ((entry.value / total) * 100).toFixed(1);
                    return (
                        <div key={`legend-${entry.name}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.fill }} />
                                <span className="text-xs text-muted-foreground">{entry.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono-nums text-foreground font-medium">
                                    {(entry.value / 1000).toFixed(1)}t
                                </span>
                                <span className="text-2xs text-muted-foreground w-10 text-right font-mono-nums">
                                    {pct}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}