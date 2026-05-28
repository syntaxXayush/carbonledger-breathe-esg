'use client';

import React, { useState, useMemo } from 'react';
import {
    ScrollText, CheckCircle2, XCircle, Pencil, Lock, Zap, Users,
    ChevronDown, ChevronRight, Download, Search, Filter, X, ArrowUpDown,
    Clock, User, Building2, FileText
} from 'lucide-react';
import { mockAuditLog, AuditLogEntry, AuditEventType } from '@/lib/auditLogData';

// ─── Event type metadata ────────────────────────────────────────────────────

const EVENT_META: Record<AuditEventType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    record_approved: {
        label: 'Approved',
        icon: <CheckCircle2 size={13} />,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400',
    },
    record_rejected: {
        label: 'Rejected',
        icon: <XCircle size={13} />,
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/30 text-red-400',
    },
    record_edit: {
        label: 'Edited',
        icon: <Pencil size={13} />,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
    },
    source_correction: {
        label: 'Source Fix',
        icon: <FileText size={13} />,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
    },
    bulk_approve: {
        label: 'Bulk Approve',
        icon: <Users size={13} />,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400',
    },
    bulk_reject: {
        label: 'Bulk Reject',
        icon: <Users size={13} />,
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/30 text-red-400',
    },
    record_locked: {
        label: 'Locked',
        icon: <Lock size={13} />,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10 border-purple-400/30 text-purple-400',
    },
    emission_factor_override: {
        label: 'EF Override',
        icon: <Zap size={13} />,
        color: 'text-orange-400',
        bg: 'bg-orange-400/10 border-orange-400/30 text-orange-400',
    },
};

const SCOPE_COLOR: Record<number, string> = {
    1: 'text-teal-400 bg-teal-400/10 border-teal-400/30',
    2: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    3: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTs(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    });
}

function exportToCSV(entries: AuditLogEntry[]) {
    const headers = [
        'ID', 'Timestamp', 'Event Type', 'Record ID', 'Category', 'Scope',
        'Analyst', 'Analyst Email', 'Tenant', 'Comment', 'Affected Count',
        'Field Diffs'
    ];
    const rows = entries.map((e) => [
        e.id,
        e.timestamp,
        e.eventType,
        e.recordId,
        e.recordCategory,
        `Scope ${e.scope}`,
        e.analystName,
        e.analystEmail,
        e.tenantName,
        `"${(e.comment ?? '').replace(/"/g, '""')}"`,
        e.affectedCount ?? '',
        e.diffs
            ? `"${e.diffs.map((d) => `${d.field}: ${d.before} → ${d.after}`).join('; ')}"`
            : '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Diff Row ────────────────────────────────────────────────────────────────

function DiffTable({ diffs }: { diffs: AuditLogEntry['diffs'] }) {
    if (!diffs || diffs.length === 0) return null;
    return (
        <div className="mt-3 rounded-md border border-border overflow-hidden">
            <table className="w-full text-xs">
                <thead>
                    <tr className="bg-muted/60 border-b border-border">
                        <th className="text-left px-3 py-1.5 text-muted-foreground font-medium w-1/3">Field</th>
                        <th className="text-left px-3 py-1.5 text-muted-foreground font-medium w-1/3">Before</th>
                        <th className="text-left px-3 py-1.5 text-muted-foreground font-medium w-1/3">After</th>
                    </tr>
                </thead>
                <tbody>
                    {diffs.map((d, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                            <td className="px-3 py-1.5 font-mono text-muted-foreground">{d.field}</td>
                            <td className="px-3 py-1.5 font-mono text-red-400 line-through opacity-70">{d.before}</td>
                            <td className="px-3 py-1.5 font-mono text-emerald-400">{d.after}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Audit Row ───────────────────────────────────────────────────────────────

function AuditRow({ entry }: { entry: AuditLogEntry }) {
    const [expanded, setExpanded] = useState(false);
    const meta = EVENT_META[entry.eventType];
    const hasDiffs = entry.diffs && entry.diffs.length > 0;
    const hasDetail = hasDiffs || entry.comment || entry.affectedCount;

    return (
        <div className="border-b border-border last:border-0">
            {/* Main row */}
            <div
                className={`flex items-start gap-3 px-4 py-3 transition-colors ${hasDetail ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                onClick={() => hasDetail && setExpanded(!expanded)}
            >
                {/* Event icon */}
                <div className={`mt-0.5 flex-shrink-0 ${meta.color}`}>{meta.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Event badge */}
                        <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded border ${meta.bg}`}>
                            {meta.label}
                        </span>
                        {/* Scope badge */}
                        <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded border ${SCOPE_COLOR[entry.scope]}`}>
                            S{entry.scope}
                        </span>
                        {/* Category */}
                        <span className="text-xs text-foreground font-medium truncate">{entry.recordCategory}</span>
                        {entry.affectedCount && (
                            <span className="text-2xs text-muted-foreground">({entry.affectedCount} records)</span>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-2xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User size={10} />
                            {entry.analystName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Building2 size={10} />
                            {entry.tenantName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatTs(entry.timestamp)}
                        </span>
                        <span className="font-mono text-muted-foreground/60">{entry.recordId}</span>
                    </div>

                    {/* Expanded detail */}
                    {expanded && (
                        <div className="mt-3">
                            {entry.comment && (
                                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-md px-3 py-2 border border-border">
                                    {entry.comment}
                                </p>
                            )}
                            {hasDiffs && <DiffTable diffs={entry.diffs} />}
                        </div>
                    )}
                </div>

                {/* Expand toggle */}
                {hasDetail && (
                    <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const ALL_EVENT_TYPES = Object.keys(EVENT_META) as AuditEventType[];

export default function AuditLogClient() {
    const [search, setSearch] = useState('');
    const [filterEvent, setFilterEvent] = useState<AuditEventType | 'all'>('all');
    const [filterScope, setFilterScope] = useState<'all' | '1' | '2' | '3'>('all');
    const [filterAnalyst, setFilterAnalyst] = useState<string>('all');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
    const [showFilters, setShowFilters] = useState(false);

    const analysts = useMemo(() => {
        const names = [...new Set(mockAuditLog.map((e) => e.analystName))];
        return names.sort();
    }, []);

    const filtered = useMemo(() => {
        let data = [...mockAuditLog];

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (e) =>
                    e.recordCategory.toLowerCase().includes(q) ||
                    e.analystName.toLowerCase().includes(q) ||
                    e.recordId.toLowerCase().includes(q) ||
                    (e.comment ?? '').toLowerCase().includes(q) ||
                    e.tenantName.toLowerCase().includes(q)
            );
        }
        if (filterEvent !== 'all') data = data.filter((e) => e.eventType === filterEvent);
        if (filterScope !== 'all') data = data.filter((e) => String(e.scope) === filterScope);
        if (filterAnalyst !== 'all') data = data.filter((e) => e.analystName === filterAnalyst);

        data.sort((a, b) => {
            const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            return sortDir === 'desc' ? -diff : diff;
        });

        return data;
    }, [search, filterEvent, filterScope, filterAnalyst, sortDir]);

    const activeFilterCount = [
        filterEvent !== 'all',
        filterScope !== 'all',
        filterAnalyst !== 'all',
    ].filter(Boolean).length;

    // Stats
    const stats = useMemo(() => ({
        total: mockAuditLog.length,
        approved: mockAuditLog.filter((e) => e.eventType === 'record_approved' || e.eventType === 'bulk_approve').length,
        rejected: mockAuditLog.filter((e) => e.eventType === 'record_rejected' || e.eventType === 'bulk_reject').length,
        edits: mockAuditLog.filter((e) => e.eventType === 'record_edit' || e.eventType === 'source_correction' || e.eventType === 'emission_factor_override').length,
        locked: mockAuditLog.filter((e) => e.eventType === 'record_locked').length,
    }), []);

    return (
        <div className="flex flex-col h-full">
            {/* Page header */}
            <div className="px-6 py-5 border-b border-border bg-card">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <ScrollText size={20} className="text-primary" />
                            <h1 className="text-lg font-semibold text-foreground">Audit Log</h1>
                            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                                Immutable
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Complete tamper-evident trail of all record edits, approvals, rejections, and source corrections.
                        </p>
                    </div>
                    <button
                        onClick={() => exportToCSV(filtered)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/20 transition-colors flex-shrink-0"
                    >
                        <Download size={14} />
                        Export CSV
                        <span className="text-2xs opacity-70">({filtered.length})</span>
                    </button>
                </div>

                {/* Stats bar */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    {[
                        { label: 'Total Events', value: stats.total, color: 'text-foreground' },
                        { label: 'Approvals', value: stats.approved, color: 'text-emerald-400' },
                        { label: 'Rejections', value: stats.rejected, color: 'text-red-400' },
                        { label: 'Edits / Corrections', value: stats.edits, color: 'text-amber-400' },
                        { label: 'Locked', value: stats.locked, color: 'text-purple-400' },
                    ].map((s) => (
                        <div key={s.label} className="flex flex-col">
                            <span className={`text-xl font-bold font-mono-nums ${s.color}`}>{s.value}</span>
                            <span className="text-2xs text-muted-foreground">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search records, analysts, categories…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Filter toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors ${showFilters || activeFilterCount > 0
                            ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Filter size={13} />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-primary text-background text-2xs font-bold flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Sort */}
                <button
                    onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowUpDown size={13} />
                    {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
                </button>

                <span className="text-2xs text-muted-foreground ml-auto">
                    {filtered.length} of {mockAuditLog.length} events
                </span>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="px-6 py-3 border-b border-border bg-muted/30 flex flex-wrap gap-4 items-end">
                    {/* Event type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">Event Type</label>
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value as AuditEventType | 'all')}
                            className="text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary/50"
                        >
                            <option value="all">All events</option>
                            {ALL_EVENT_TYPES.map((t) => (
                                <option key={t} value={t}>{EVENT_META[t].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Scope */}
                    <div className="flex flex-col gap-1">
                        <label className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">Scope</label>
                        <select
                            value={filterScope}
                            onChange={(e) => setFilterScope(e.target.value as 'all' | '1' | '2' | '3')}
                            className="text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary/50"
                        >
                            <option value="all">All scopes</option>
                            <option value="1">Scope 1</option>
                            <option value="2">Scope 2</option>
                            <option value="3">Scope 3</option>
                        </select>
                    </div>

                    {/* Analyst */}
                    <div className="flex flex-col gap-1">
                        <label className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">Analyst</label>
                        <select
                            value={filterAnalyst}
                            onChange={(e) => setFilterAnalyst(e.target.value)}
                            className="text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary/50"
                        >
                            <option value="all">All analysts</option>
                            {analysts.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => { setFilterEvent('all'); setFilterScope('all'); setFilterAnalyst('all'); }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pb-1.5"
                        >
                            <X size={12} /> Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Log entries */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ScrollText size={36} className="text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">No audit events match your filters.</p>
                        <button
                            onClick={() => { setSearch(''); setFilterEvent('all'); setFilterScope('all'); setFilterAnalyst('all'); }}
                            className="mt-3 text-xs text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filtered.map((entry) => (
                            <AuditRow key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
