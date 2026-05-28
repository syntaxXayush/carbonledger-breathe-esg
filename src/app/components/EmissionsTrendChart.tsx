'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { weeklyTrendData } from '@/lib/mockData';

interface TooltipPayloadItem {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl text-xs">
            <p className="text-muted-foreground font-medium mb-2">{label}</p>
            {payload.map((entry) => (
                <div key={`tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                    <span className="font-mono-nums font-semibold text-foreground">
                        {(entry.value / 1000).toFixed(1)}t
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function EmissionsTrendChart() {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyTrendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id="gradScope1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--scope1)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--scope1)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradScope2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--scope2)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--scope2)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradScope3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--scope3)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--scope3)" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="week"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}t`}
                    width={36}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="scope1"
                    name="Scope 1"
                    stroke="var(--scope1)"
                    strokeWidth={1.5}
                    fill="url(#gradScope1)"
                />
                <Area
                    type="monotone"
                    dataKey="scope2"
                    name="Scope 2"
                    stroke="var(--scope2)"
                    strokeWidth={1.5}
                    fill="url(#gradScope2)"
                />
                <Area
                    type="monotone"
                    dataKey="scope3"
                    name="Scope 3"
                    stroke="var(--scope3)"
                    strokeWidth={1.5}
                    fill="url(#gradScope3)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}