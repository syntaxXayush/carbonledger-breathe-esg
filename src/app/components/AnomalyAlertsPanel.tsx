import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { mockEmissionsRecords } from '@/lib/mockData';
import ScopeBadge from '@/components/ui/ScopeBadge';

export default function AnomalyAlertsPanel() {
    const anomalies = mockEmissionsRecords?.filter((r) => r?.isAnomalous)?.sort((a, b) => (b?.anomalySigma ?? 0) - (a?.anomalySigma ?? 0));

    return (
        <div className="card-elevated p-5 h-full border border-warning/20 bg-warning/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-warning" />
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Anomaly Alerts</h2>
                        <p className="text-2xs text-muted-foreground mt-0.5">
                            {anomalies?.length} records outside ±2σ
                        </p>
                    </div>
                </div>
                <Link
                    href="/review-queue"
                    className="flex items-center gap-1 text-2xs text-primary hover:text-accent transition-colors"
                >
                    Review <ArrowRight size={11} />
                </Link>
            </div>
            {anomalies?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Zap size={28} className="text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">No anomalies detected</p>
                    <p className="text-2xs text-muted-foreground mt-1">
                        All records are within ±2σ of the historical baseline.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {anomalies?.map((rec) => (
                        <div
                            key={rec?.id}
                            className="px-3 py-2.5 rounded-md bg-card border border-alert/20 hover:border-alert/40 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="text-xs font-medium text-foreground truncate">
                                    {rec?.category}
                                </span>
                                <span className="text-2xs font-mono-nums font-bold text-alert flex-shrink-0">
                                    {rec?.anomalySigma?.toFixed(1)}σ
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ScopeBadge scope={rec?.scope} />
                                <span className="text-2xs text-muted-foreground font-mono-nums">
                                    {rec?.kgco2e?.toLocaleString()} kgCO₂e
                                </span>
                                <span className="text-2xs text-muted-foreground">
                                    {rec?.sourceType}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}