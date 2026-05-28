import React from 'react';
import { RefreshCw, Download, Calendar } from 'lucide-react';

export default function OverviewHeader() {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                    Emissions Overview
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Meridian Industrial Group · Reporting period: Jan – Apr 2026 · Last updated{' '}
                    <span className="font-mono-nums text-foreground/70">27 May 2026, 18:46 UTC</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                    <Calendar size={14} />
                    <span>Apr 2026</span>
                </button>
                <button className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                    <Download size={14} />
                    <span>Export</span>
                </button>
                <button className="btn-primary flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    );
}