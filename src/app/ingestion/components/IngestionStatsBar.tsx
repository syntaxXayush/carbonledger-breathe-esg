import React from 'react';
import { CheckCircle2, XCircle, Copy, Loader2 } from 'lucide-react';
import { mockIngestionJobs } from '@/lib/mockData';

export default function IngestionStatsBar() {
    const jobs = mockIngestionJobs;
    const completed = jobs?.filter((j) => j?.status === 'completed')?.length;
    const failed = jobs?.filter((j) => j?.status === 'failed')?.length;
    const running = jobs?.filter((j) => j?.status === 'running')?.length;
    const totalRecords = jobs?.reduce((s, j) => s + j?.parsedCount, 0);
    const totalErrors = jobs?.reduce((s, j) => s + j?.errorCount, 0);
    const totalDupes = jobs?.reduce((s, j) => s + j?.duplicateCount, 0);

    const stats = [
        {
            id: 'stat-completed',
            label: 'Completed',
            value: completed,
            icon: <CheckCircle2 size={14} className="text-success" />,
            color: 'text-success',
        },
        {
            id: 'stat-failed',
            label: 'Failed',
            value: failed,
            icon: <XCircle size={14} className="text-alert" />,
            color: 'text-alert',
        },
        {
            id: 'stat-running',
            label: 'Running',
            value: running,
            icon: <Loader2 size={14} className="text-primary animate-spin" />,
            color: 'text-primary',
        },
        {
            id: 'stat-records',
            label: 'Total Records',
            value: totalRecords?.toLocaleString(),
            icon: null,
            color: 'text-foreground',
        },
        {
            id: 'stat-errors',
            label: 'Parse Errors',
            value: totalErrors,
            icon: null,
            color: totalErrors > 0 ? 'text-warning' : 'text-success',
        },
        {
            id: 'stat-dupes',
            label: 'Duplicates Rejected',
            value: totalDupes,
            icon: <Copy size={14} className="text-muted-foreground" />,
            color: 'text-muted-foreground',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3 mb-5">
            {stats?.map((stat) => (
                <div key={stat?.id} className="card-elevated px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        {stat?.icon}
                        <p className="text-2xs text-muted-foreground font-medium uppercase tracking-wider">
                            {stat?.label}
                        </p>
                    </div>
                    <p className={`text-xl font-bold font-mono-nums ${stat?.color}`}>
                        {stat?.value}
                    </p>
                </div>
            ))}
        </div>
    );
}