'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Eye,
    RotateCcw,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import { mockIngestionJobs, IngestionJob, SourceType } from '@/lib/mockData';
import { api } from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';
import JobDetailDrawer from './JobDetailDrawer';

interface Props {
    sourceFilter: 'All' | SourceType;
}

type SortKey = keyof IngestionJob;
type SortDir = 'asc' | 'desc' | null;

const sourceColors: Record<string, string> = {
    SAP: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
    Utility: 'text-blue-400 bg-blue-400/10 border border-blue-400/20',
    Travel: 'text-teal-400 bg-teal-400/10 border border-teal-400/20',
};

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDuration(ms?: number): string {
    if (!ms) return '—';
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
}

function ProgressRing({ value }: { value: number }) {
    const color =
        value >= 80 ? 'var(--success)' : value >= 50 ? 'var(--warning)' : 'var(--alert)';
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-2xs font-mono-nums" style={{ color }}>
                {value}%
            </span>
        </div>
    );
}

export default function IngestionJobsTable({ sourceFilter }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>('startedAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [selectedJob, setSelectedJob] = useState<IngestionJob | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [jobs, setJobs] = useState<IngestionJob[]>([]);

    useEffect(() => {
        api.getJobs().then((data: any) => {
            const mapped = data.map((d: any) => ({
                id: d.id,
                sourceId: d.source_id,
                sourceName: d.source_name,
                sourceType: d.source_type,
                format: d.format,
                status: d.status,
                fileName: d.file_name,
                recordCount: d.record_count,
                parsedCount: d.parsed_count,
                errorCount: d.error_count,
                duplicateCount: d.duplicate_count,
                startedAt: d.started_at,
                completedAt: d.completed_at,
                durationMs: d.duration_ms,
                tenantId: d.tenant,
                tenantName: 'Meridian Industrial Group',
                uploadedBy: d.uploaded_by,
                confidenceAvg: d.confidence_avg
            }));
            setJobs(mapped);
        }).catch(err => console.error('Failed to load jobs', err));
    }, []);

    const filtered = useMemo(() => {
        let data = [...jobs];
        if (sourceFilter !== 'All') {
            data = data.filter((j) => j.sourceType === sourceFilter);
        }
        if (sortKey && sortDir) {
            data.sort((a, b) => {
                const av = a[sortKey];
                const bv = b[sortKey];
                if (av === undefined || bv === undefined) return 0;
                const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
                return sortDir === 'asc' ? cmp : -cmp;
            });
        }
        return data;
    }, [sourceFilter, sortKey, sortDir]);

    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col)
            return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
        if (sortDir === 'asc') return <ChevronUp size={12} className="text-primary" />;
        if (sortDir === 'desc') return <ChevronDown size={12} className="text-primary" />;
        return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
    }

    const columns: { key: SortKey; label: string; width?: string }[] = [
        { key: 'fileName', label: 'File / Source', width: 'min-w-[200px]' },
        { key: 'sourceType', label: 'Source', width: 'w-24' },
        { key: 'format', label: 'Format', width: 'min-w-[130px]' },
        { key: 'status', label: 'Status', width: 'w-28' },
        { key: 'parsedCount', label: 'Parsed', width: 'w-24' },
        { key: 'errorCount', label: 'Errors', width: 'w-20' },
        { key: 'duplicateCount', label: 'Dupes', width: 'w-20' },
        { key: 'confidenceAvg', label: 'Confidence', width: 'w-36' },
        { key: 'startedAt', label: 'Started', width: 'w-36' },
        { key: 'durationMs', label: 'Duration', width: 'w-24' },
    ];

    return (
        <>
            <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                {columns.map((col) => (
                                    <th
                                        key={`th-${col.key}`}
                                        className={`px-4 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none ${col.width ?? ''}`}
                                        onClick={() => handleSort(col.key)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {col.label}
                                            <SortIcon col={col.key} />
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((job, idx) => (
                                <tr
                                    key={job.id}
                                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${idx % 2 === 0 ? '' : 'bg-muted/10'
                                        }`}
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-xs font-medium text-foreground truncate max-w-[220px] font-mono-nums">
                                                {job.fileName}
                                            </p>
                                            <p className="text-2xs text-muted-foreground mt-0.5 truncate max-w-[220px]">
                                                {job.sourceName}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-2xs px-2 py-0.5 rounded font-medium ${sourceColors[job.sourceType]}`}
                                        >
                                            {job.sourceType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-muted-foreground font-mono-nums">
                                            {job.format}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            {job.status === 'running' && (
                                                <Loader2 size={12} className="text-primary animate-spin" />
                                            )}
                                            {job.status === 'completed' && (
                                                <CheckCircle2 size={12} className="text-success" />
                                            )}
                                            {job.status === 'failed' && (
                                                <XCircle size={12} className="text-alert" />
                                            )}
                                            {job.status === 'pending' && (
                                                <Clock size={12} className="text-muted-foreground" />
                                            )}
                                            <StatusBadge status={job.status} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-mono-nums text-foreground">
                                            {job.parsedCount.toLocaleString()}
                                        </span>
                                        {job.status === 'running' && (
                                            <span className="text-2xs text-muted-foreground ml-1">…</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-xs font-mono-nums font-semibold ${job.errorCount > 0 ? 'text-alert' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {job.errorCount}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-xs font-mono-nums ${job.duplicateCount > 0 ? 'text-warning' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {job.duplicateCount}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {job.status === 'failed' ? (
                                            <span className="text-2xs text-muted-foreground">—</span>
                                        ) : (
                                            <ProgressRing value={job.confidenceAvg} />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-muted-foreground font-mono-nums">
                                            {formatDate(job.startedAt)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-mono-nums text-muted-foreground">
                                            {formatDuration(job.durationMs)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div
                                            className="flex items-center gap-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setSelectedJob(job)}
                                                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                title="View job details"
                                            >
                                                <Eye size={13} />
                                            </button>
                                            {job.status === 'failed' && (
                                                <button
                                                    className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Retry ingestion"
                                                >
                                                    <RotateCcw size={13} />
                                                </button>
                                            )}
                                            <button
                                                className="p-1.5 rounded text-muted-foreground hover:text-alert hover:bg-alert/10 transition-colors"
                                                title="Delete job record"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Showing{' '}
                        <span className="font-mono-nums text-foreground">
                            {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-mono-nums text-foreground">{filtered.length}</span> jobs
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-2.5 py-1.5 rounded text-xs btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={`page-${i + 1}`}
                                onClick={() => setPage(i + 1)}
                                className={`w-7 h-7 rounded text-xs font-mono-nums transition-colors ${page === i + 1
                                        ? 'bg-primary text-primary-foreground font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-2.5 py-1.5 rounded text-xs btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedJob && (
                <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </>
    );
}