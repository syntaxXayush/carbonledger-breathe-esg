'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { mockEmissionsRecords, EmissionsRecord, ReviewStatus, SourceType, Scope } from '@/lib/mockData';
import ReviewQueueTable from './ReviewQueueTable';
import ReviewFilterSidebar from './ReviewFilterSidebar';
import BulkActionBar from './BulkActionBar';
import ReviewQueueStats from './ReviewQueueStats';
import BulkCommentModal from './BulkCommentModal';

export interface ReviewFilters {
    sourceType: SourceType | 'All';
    scope: Scope | 'All';
    status: ReviewStatus | 'All';
    search: string;
    anomalyOnly: boolean;
    confidenceMax: number;
}

const defaultFilters: ReviewFilters = {
    sourceType: 'All',
    scope: 'All',
    status: 'pending',
    search: '',
    anomalyOnly: false,
    confidenceMax: 100,
};

export default function ReviewQueueClient() {
    const [filters, setFilters] = useState<ReviewFilters>(defaultFilters);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filterOpen, setFilterOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
    const [records, setRecords] = useState<EmissionsRecord[]>([]);

    useEffect(() => {
        api.getRecords().then((data: any) => {
            // Map the Django snake_case to frontend camelCase
            const mapped = data.map((d: any) => ({
                id: d.id,
                rawRecordId: d.raw_record_id,
                tenantId: d.tenant,
                scope: d.scope,
                category: d.category,
                sourceType: d.source_type,
                sourceFormat: d.source_format,
                activityValue: d.activity_value,
                unit: d.unit,
                normalizedValue: d.normalized_value,
                normalizedUnit: d.normalized_unit,
                emissionFactor: d.emission_factor,
                emissionFactorSource: d.emission_factor_source,
                kgco2e: d.kgco2e,
                periodStart: d.period_start,
                periodEnd: d.period_end,
                reviewStatus: d.review_status,
                confidenceScore: d.confidence_score,
                isAnomalous: d.is_anomalous,
                anomalySigma: d.anomaly_sigma,
                isDuplicate: d.is_duplicate,
                jobId: d.job,
                provenance: d.provenance || {},
                fields: d.fields || {}
            }));
            setRecords(mapped);
        }).catch((err) => console.error('Failed to fetch records', err));
    }, []);

    const filtered = useMemo(() => {
        return records.filter((r) => {
            if (filters.sourceType !== 'All' && r.sourceType !== filters.sourceType) return false;
            if (filters.scope !== 'All' && r.scope !== filters.scope) return false;
            if (filters.status !== 'All' && r.reviewStatus !== filters.status) return false;
            if (filters.anomalyOnly && !r.isAnomalous) return false;
            if (r.confidenceScore > filters.confidenceMax) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (
                    !r.id.toLowerCase().includes(q) &&
                    !r.category.toLowerCase().includes(q) &&
                    !r.sourceType.toLowerCase().includes(q) &&
                    !r.provenance.fileName.toLowerCase().includes(q)
                )
                    return false;
            }
            return true;
        });
    }, [records, filters]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filtered.map((r) => r.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const handleBulkComplete = async (action: 'approve' | 'reject', comment: string) => {
        try {
            await api.bulkReview(Array.from(selectedIds), action);
            const newStatus: ReviewStatus = action === 'approve' ? 'approved' : 'rejected';
            setRecords((prev) =>
                prev.map((r) =>
                    selectedIds.has(r.id) ? { ...r, reviewStatus: newStatus } : r
                )
            );
            setSelectedIds(new Set());
            setBulkAction(null);
        } catch (error) {
            console.error('Failed to update bulk actions', error);
        }
    };

    const pendingCount = records.filter((r) => r.reviewStatus === 'pending').length;
    const anomalyCount = records.filter((r) => r.isAnomalous && r.reviewStatus === 'pending').length;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Filter Sidebar */}
            <ReviewFilterSidebar
                open={filterOpen}
                filters={filters}
                onChange={setFilters}
                onClose={() => setFilterOpen(false)}
                totalCount={filtered.length}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="px-6 lg:px-8 py-5 border-b border-border flex-shrink-0">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                                Review Queue
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-mono-nums text-alert font-semibold">{pendingCount}</span> records pending analyst sign-off ·{' '}
                                {anomalyCount > 0 && (
                                    <span className="text-warning font-medium">
                                        {anomalyCount} anomaly flag{anomalyCount > 1 ? 's' : ''} require urgent review
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFilterOpen((o) => !o)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${filterOpen
                                        ? 'bg-primary/15 text-primary border border-primary/30' : 'btn-ghost'
                                    }`}
                            >
                                <Filter size={14} />
                                <span>Filters</span>
                                {(filters.sourceType !== 'All' ||
                                    filters.scope !== 'All' ||
                                    filters.anomalyOnly ||
                                    filters.confidenceMax < 100) && (
                                        <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-2xs font-bold flex items-center justify-center">
                                            !
                                        </span>
                                    )}
                            </button>
                        </div>
                    </div>

                    {/* Search + Quick filters */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search records, files, categories…"
                                value={filters.search}
                                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                                className="w-full bg-input border border-border rounded-md pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {/* Status quick filter */}
                        <div className="flex items-center gap-1">
                            {(['All', 'pending', 'approved', 'rejected', 'locked'] as const).map((s) => (
                                <button
                                    key={`qf-${s}`}
                                    onClick={() => setFilters((f) => ({ ...f, status: s }))}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${filters.status === s
                                            ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                                        }`}
                                >
                                    {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Anomaly toggle */}
                        <button
                            onClick={() => setFilters((f) => ({ ...f, anomalyOnly: !f.anomalyOnly }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border ${filters.anomalyOnly
                                    ? 'bg-warning/15 text-warning border-warning/30' : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            ⚡ Anomalies only
                        </button>
                    </div>
                </div>

                <ReviewQueueStats records={filtered} />

                <div className="flex-1 overflow-y-auto scrollbar-thin relative">
                    <ReviewQueueTable
                        records={filtered}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                        onRecordUpdate={(updated) => {
                            setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                        }}
                    />
                </div>

                {selectedIds.size > 0 && (
                    <BulkActionBar
                        count={selectedIds.size}
                        onApprove={() => setBulkAction('approve')}
                        onReject={() => setBulkAction('reject')}
                        onClear={() => setSelectedIds(new Set())}
                    />
                )}
            </div>

            {bulkAction && (
                <BulkCommentModal
                    action={bulkAction}
                    count={selectedIds.size}
                    onConfirm={(comment) => handleBulkComplete(bulkAction, comment)}
                    onClose={() => setBulkAction(null)}
                />
            )}
        </div>
    );
}