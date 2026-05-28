import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { mockIngestionJobs } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';

const sourceColors: Record<string, string> = {
    SAP: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Utility: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Travel: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
};

function formatDuration(ms?: number): string {
    if (!ms) return '—';
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
}

function StatusIcon({ status }: { status: string }) {
    if (status === 'completed')
        return <CheckCircle2 size={14} className="text-success flex-shrink-0" />;
    if (status === 'failed')
        return <XCircle size={14} className="text-alert flex-shrink-0" />;
    if (status === 'running')
        return <Loader2 size={14} className="text-primary animate-spin flex-shrink-0" />;
    return <Clock size={14} className="text-muted-foreground flex-shrink-0" />;
}

export default function RecentJobsFeed() {
    const recent = mockIngestionJobs.slice(0, 5);

    return (
        <div className="card-elevated p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-semibold text-foreground">Recent Ingestion Jobs</h2>
                    <p className="text-2xs text-muted-foreground mt-0.5">Last 5 pipeline runs</p>
                </div>
                <Link
                    href="/ingestion"
                    className="flex items-center gap-1 text-2xs text-primary hover:text-accent transition-colors"
                >
                    View all <ArrowRight size={11} />
                </Link>
            </div>

            <div className="space-y-2">
                {recent.map((job) => (
                    <div
                        key={job.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer border border-transparent hover:border-border"
                    >
                        <StatusIcon status={job.status} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
                                    {job.fileName}
                                </span>
                                <span
                                    className={`text-2xs px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${sourceColors[job.sourceType]}`}
                                >
                                    {job.sourceType}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xs text-muted-foreground font-mono-nums">
                                    {job.parsedCount.toLocaleString()} records
                                </span>
                                {job.errorCount > 0 && (
                                    <span className="text-2xs text-alert font-mono-nums">
                                        {job.errorCount} errors
                                    </span>
                                )}
                                <span className="text-2xs text-muted-foreground font-mono-nums">
                                    {formatDuration(job.durationMs)}
                                </span>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <StatusBadge status={job.status as any} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}