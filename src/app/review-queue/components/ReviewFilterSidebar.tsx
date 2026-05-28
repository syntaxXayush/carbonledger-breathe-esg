'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ReviewFilters } from './ReviewQueueClient';
import { Scope, ReviewStatus } from '@/lib/mockData';

interface Props {
    open: boolean;
    filters: ReviewFilters;
    onChange: (f: ReviewFilters) => void;
    onClose: () => void;
    totalCount: number;
}

const defaultFilters: ReviewFilters = {
    sourceType: 'All',
    scope: 'All',
    status: 'pending',
    search: '',
    anomalyOnly: false,
    confidenceMax: 100,
};

export default function ReviewFilterSidebar({ open, filters, onChange, onClose, totalCount }: Props) {
    if (!open) return null;

    const set = (patch: Partial<ReviewFilters>) => onChange({ ...filters, ...patch });

    return (
        <div className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Filters</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onChange(defaultFilters)}
                        className="text-2xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <RotateCcw size={11} /> Reset
                    </button>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={15} />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-5">
                <p className="text-2xs text-muted-foreground">
                    <span className="font-mono-nums font-semibold text-foreground">{totalCount}</span> records match
                </p>

                {/* Source Type */}
                <div>
                    <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Source Type
                    </label>
                    <div className="space-y-1">
                        {(['All', 'SAP', 'Utility', 'Travel'] as const).map((s) => (
                            <button
                                key={`filter-src-${s}`}
                                onClick={() => set({ sourceType: s })}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${filters.sourceType === s
                                        ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scope */}
                <div>
                    <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Emissions Scope
                    </label>
                    <div className="space-y-1">
                        {(['All', 1, 2, 3] as const).map((s) => (
                            <button
                                key={`filter-scope-${s}`}
                                onClick={() => set({ scope: s as Scope | 'All' })}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${filters.scope === s
                                        ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {s === 'All' ? 'All Scopes' : `Scope ${s}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Review Status
                    </label>
                    <div className="space-y-1">
                        {(['All', 'pending', 'approved', 'rejected', 'locked'] as const).map((s) => (
                            <button
                                key={`filter-status-${s}`}
                                onClick={() => set({ status: s as ReviewStatus | 'All' })}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${filters.status === s
                                        ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Anomaly only */}
                <div>
                    <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Data Quality
                    </label>
                    <button
                        onClick={() => set({ anomalyOnly: !filters.anomalyOnly })}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs border transition-all ${filters.anomalyOnly
                                ? 'bg-warning/15 border-warning/30 text-warning' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <span>Anomalies only (±2σ)</span>
                        <span
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filters.anomalyOnly
                                    ? 'bg-warning border-warning' : 'border-border'
                                }`}
                        >
                            {filters.anomalyOnly && <span className="text-2xs text-card font-bold">✓</span>}
                        </span>
                    </button>
                </div>

                {/* Confidence threshold */}
                <div>
                    <label className="block text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Max Confidence Score
                    </label>
                    <p className="text-2xs text-muted-foreground mb-2">
                        Show records with confidence ≤{' '}
                        <span className="font-mono-nums font-semibold text-foreground">{filters.confidenceMax}%</span>
                    </p>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={filters.confidenceMax}
                        onChange={(e) => set({ confidenceMax: Number(e.target.value) })}
                        className="w-full accent-primary"
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-2xs text-muted-foreground font-mono-nums">0%</span>
                        <span className="text-2xs text-muted-foreground font-mono-nums">100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}