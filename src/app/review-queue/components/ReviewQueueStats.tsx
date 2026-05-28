import React from 'react';
import { EmissionsRecord } from '@/lib/mockData';

interface Props {
    records: EmissionsRecord[];
}

export default function ReviewQueueStats({ records }: Props) {
    const totalKgCO2e = records.reduce((s, r) => s + r.kgco2e, 0);
    const avgConfidence =
        records.length > 0
            ? Math.round(records.reduce((s, r) => s + r.confidenceScore, 0) / records.length)
            : 0;
    const anomalyCount = records.filter((r) => r.isAnomalous).length;
    const duplicateCount = records.filter((r) => r.isDuplicate).length;

    return (
        <div className="flex items-center gap-6 px-6 py-3 border-b border-border bg-muted/20 flex-shrink-0">
            <div>
                <span className="text-2xs text-muted-foreground">Showing </span>
                <span className="text-xs font-mono-nums font-semibold text-foreground">{records.length}</span>
                <span className="text-2xs text-muted-foreground"> records</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div>
                <span className="text-2xs text-muted-foreground">Total kgCO₂e: </span>
                <span className="text-xs font-mono-nums font-semibold text-foreground">
                    {totalKgCO2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div>
                <span className="text-2xs text-muted-foreground">Avg confidence: </span>
                <span
                    className={`text-xs font-mono-nums font-semibold ${avgConfidence >= 80 ? 'text-success' : avgConfidence >= 50 ? 'text-warning' : 'text-alert'
                        }`}
                >
                    {avgConfidence}%
                </span>
            </div>
            {anomalyCount > 0 && (
                <>
                    <div className="w-px h-4 bg-border" />
                    <div>
                        <span className="text-2xs text-muted-foreground">Anomalies: </span>
                        <span className="text-xs font-mono-nums font-semibold text-warning">{anomalyCount}</span>
                    </div>
                </>
            )}
            {duplicateCount > 0 && (
                <>
                    <div className="w-px h-4 bg-border" />
                    <div>
                        <span className="text-2xs text-muted-foreground">Duplicates: </span>
                        <span className="text-xs font-mono-nums font-semibold text-alert">{duplicateCount}</span>
                    </div>
                </>
            )}
        </div>
    );
}