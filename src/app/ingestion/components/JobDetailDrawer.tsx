'use client';

import React from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { IngestionJob } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';

interface Props {
    job: IngestionJob;
    onClose: () => void;
}

function DetailRow({ label, value, mono = false }: { label: string; value: string | number; mono?: boolean }) {
    return (
        <div className="flex items-start justify-between py-2 border-b border-border/50">
            <span className="text-xs text-muted-foreground w-40 flex-shrink-0">{label}</span>
            <span className={`text-xs text-foreground text-right ${mono ? 'font-mono-nums' : ''}`}>
                {value}
            </span>
        </div>
    );
}

export default function JobDetailDrawer({ job, onClose }: Props) {
    const successRate =
        job.parsedCount > 0
            ? (((job.parsedCount - job.errorCount) / job.parsedCount) * 100).toFixed(1)
            : '0';

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-md bg-card border-l border-border h-full overflow-y-auto scrollbar-thin animate-slide-down shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Job Details</h2>
                        <p className="text-2xs text-muted-foreground font-mono-nums mt-0.5">{job.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-5">
                    {/* Status + Source */}
                    <div className="flex items-center gap-3">
                        <StatusBadge status={job.status} size="md" />
                        <span className="text-xs text-muted-foreground">{job.sourceType} · {job.format}</span>
                    </div>

                    {/* File info */}
                    <div>
                        <h3 className="text-2xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                            File Information
                        </h3>
                        <div className="bg-muted/30 rounded-md px-3">
                            <DetailRow label="File Name" value={job.fileName} mono />
                            <DetailRow label="Source System" value={job.sourceName} />
                            <DetailRow label="Tenant" value={job.tenantName} />
                            <DetailRow label="Uploaded By" value={job.uploadedBy} mono />
                        </div>
                    </div>

                    {/* Processing stats */}
                    <div>
                        <h3 className="text-2xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                            Processing Results
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/30 rounded-md p-3 text-center">
                                <p className="text-2xl font-bold font-mono-nums text-foreground">
                                    {job.parsedCount.toLocaleString()}
                                </p>
                                <p className="text-2xs text-muted-foreground mt-0.5">Records Parsed</p>
                            </div>
                            <div className={`rounded-md p-3 text-center ${job.errorCount > 0 ? 'bg-alert/10' : 'bg-success/10'}`}>
                                <p className={`text-2xl font-bold font-mono-nums ${job.errorCount > 0 ? 'text-alert' : 'text-success'}`}>
                                    {job.errorCount}
                                </p>
                                <p className="text-2xs text-muted-foreground mt-0.5">Parse Errors</p>
                            </div>
                            <div className={`rounded-md p-3 text-center ${job.duplicateCount > 0 ? 'bg-warning/10' : 'bg-muted/30'}`}>
                                <p className={`text-2xl font-bold font-mono-nums ${job.duplicateCount > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                                    {job.duplicateCount}
                                </p>
                                <p className="text-2xs text-muted-foreground mt-0.5">Duplicates Rejected</p>
                            </div>
                            <div className="bg-muted/30 rounded-md p-3 text-center">
                                <p className="text-2xl font-bold font-mono-nums text-primary">
                                    {job.confidenceAvg}%
                                </p>
                                <p className="text-2xs text-muted-foreground mt-0.5">Avg Confidence</p>
                            </div>
                        </div>
                    </div>

                    {/* Timing */}
                    <div>
                        <h3 className="text-2xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                            Timing
                        </h3>
                        <div className="bg-muted/30 rounded-md px-3">
                            <DetailRow label="Started At" value={new Date(job.startedAt).toLocaleString('en-GB')} mono />
                            {job.completedAt && (
                                <DetailRow label="Completed At" value={new Date(job.completedAt).toLocaleString('en-GB')} mono />
                            )}
                            {job.durationMs && (
                                <DetailRow
                                    label="Duration"
                                    value={job.durationMs < 60000 ? `${(job.durationMs / 1000).toFixed(1)}s` : `${(job.durationMs / 60000).toFixed(2)}m`}
                                    mono
                                />
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {job.status === 'completed' && (
                        <button className="w-full btn-primary py-2.5 rounded-md text-sm flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} />
                            View {job.parsedCount} Emissions Records
                        </button>
                    )}
                    {job.status === 'failed' && (
                        <button className="w-full btn-primary py-2.5 rounded-md text-sm flex items-center justify-center gap-2">
                            <XCircle size={14} />
                            Retry Ingestion
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}