'use client';

import React, { useState } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    AlertTriangle,
    Lock,
    Copy,
    Eye,
    Pencil,
    Check,
    X,
    CheckSquare,
} from 'lucide-react';
import { EmissionsRecord } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import ScopeBadge from '@/components/ui/ScopeBadge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import RecordDetailDrawer from './RecordDetailDrawer';

interface Props {
    records: EmissionsRecord[];
    selectedIds: Set<string>;
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: string, checked: boolean) => void;
    onRecordUpdate: (updated: EmissionsRecord) => void;
}

type SortKey = 'kgco2e' | 'confidenceScore' | 'periodStart' | 'scope' | 'reviewStatus';
type SortDir = 'asc' | 'desc';

const sourceColors: Record<string, string> = {
    SAP: 'text-amber-400',
    Utility: 'text-blue-400',
    Travel: 'text-teal-400',
};

export default function ReviewQueueTable({
    records,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onRecordUpdate,
}: Props) {
    const [sortKey, setSortKey] = useState<SortKey>('kgco2e');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');
    const [detailRecord, setDetailRecord] = useState<EmissionsRecord | null>(null);

    const sorted = [...records].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setSortDir('desc'); }
    };

    const startEdit = (rec: EmissionsRecord, field: string, currentVal: string) => {
        if (rec.reviewStatus === 'locked' || rec.reviewStatus === 'approved') return;
        setEditingCell({ id: rec.id, field });
        setEditValue(currentVal);
    };

    const commitEdit = (rec: EmissionsRecord) => {
        if (!editingCell) return;
        const field = editingCell.field;
        const oldVal = String(rec.fields[field] ?? rec[field as keyof EmissionsRecord] ?? '');
        if (editValue !== oldVal) {
            // Backend integration point: PATCH /api/emissions-records/:id/fields { field, oldValue, newValue, actorId }
            const updated: EmissionsRecord = {
                ...rec,
                fields: { ...rec.fields, [field]: editValue },
            };
            onRecordUpdate(updated);
        }
        setEditingCell(null);
    };

    const cancelEdit = () => setEditingCell(null);

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <ChevronsUpDown size={11} className="text-muted-foreground/50" />;
        return sortDir === 'asc'
            ? <ChevronUp size={11} className="text-primary" />
            : <ChevronDown size={11} className="text-primary" />;
    }

    const allSelected = records.length > 0 && records.every((r) => selectedIds.has(r.id));
    const someSelected = records.some((r) => selectedIds.has(r.id)) && !allSelected;

    return (
        <>
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm min-w-[1100px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-border bg-card">
                            <th className="px-4 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider w-28">
                                Record ID
                            </th>
                            <th
                                className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none"
                                onClick={() => handleSort('scope')}
                            >
                                <div className="flex items-center gap-1">Scope <SortIcon col="scope" /></div>
                            </th>
                            <th className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[180px]">
                                Category
                            </th>
                            <th className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Source
                            </th>
                            <th
                                className="px-3 py-3 text-right text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none w-32"
                                onClick={() => handleSort('kgco2e')}
                            >
                                <div className="flex items-center justify-end gap-1">kgCO₂e <SortIcon col="kgco2e" /></div>
                            </th>
                            <th className="px-3 py-3 text-right text-2xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                                Activity
                            </th>
                            <th className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                                EF Source
                            </th>
                            <th
                                className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none w-28"
                                onClick={() => handleSort('periodStart')}
                            >
                                <div className="flex items-center gap-1">Period <SortIcon col="periodStart" /></div>
                            </th>
                            <th
                                className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none w-36"
                                onClick={() => handleSort('confidenceScore')}
                            >
                                <div className="flex items-center gap-1">Confidence <SortIcon col="confidenceScore" /></div>
                            </th>
                            <th
                                className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none w-28"
                                onClick={() => handleSort('reviewStatus')}
                            >
                                <div className="flex items-center gap-1">Status <SortIcon col="reviewStatus" /></div>
                            </th>
                            <th className="px-3 py-3 text-left text-2xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((rec, idx) => {
                            const isSelected = selectedIds.has(rec.id);
                            const isEditing = editingCell?.id === rec.id;
                            const canEdit = rec.reviewStatus !== 'locked' && rec.reviewStatus !== 'approved';

                            return (
                                <tr
                                    key={rec.id}
                                    className={`border-b border-border/40 transition-colors ${rec.isAnomalous ? 'anomaly-row' : idx % 2 === 0 ? '' : 'bg-muted/5'
                                        } ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                                >
                                    {/* Checkbox */}
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => onSelectOne(rec.id, e.target.checked)}
                                            className="w-3.5 h-3.5 accent-primary cursor-pointer"
                                        />
                                    </td>

                                    {/* Record ID */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-2xs font-mono-nums text-muted-foreground">{rec.id}</span>
                                            {rec.isAnomalous && (
                                                <span
                                                    className="flex items-center gap-0.5 text-2xs font-mono-nums font-bold text-alert"
                                                    title={`${rec.anomalySigma?.toFixed(1)}σ deviation from baseline`}
                                                >
                                                    <AlertTriangle size={10} />
                                                    {rec.anomalySigma?.toFixed(1)}σ
                                                </span>
                                            )}
                                            {rec.isDuplicate && (
                                                <span title="Duplicate record detected">
                                                    <Copy size={10} className="text-warning" />
                                                </span>
                                            )}
                                            {rec.reviewStatus === 'locked' && (
                                                <span title={`Locked by ${rec.lockedBy}`}>
                                                    <Lock size={10} className="text-purple-400" />
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Scope */}
                                    <td className="px-3 py-3">
                                        <ScopeBadge scope={rec.scope} category={rec.category} />
                                    </td>

                                    {/* Category */}
                                    <td className="px-3 py-3">
                                        <span className="text-xs text-foreground truncate max-w-[200px] block">
                                            {rec.category}
                                        </span>
                                        <span className={`text-2xs ${sourceColors[rec.sourceType]}`}>
                                            {rec.sourceType} · {rec.sourceFormat}
                                        </span>
                                    </td>

                                    {/* Source system */}
                                    <td className="px-3 py-3">
                                        <span className="text-2xs text-muted-foreground font-mono-nums truncate max-w-[120px] block">
                                            {rec.provenance.sourceSystem}
                                        </span>
                                    </td>

                                    {/* kgCO2e — inline editable */}
                                    <td className="px-3 py-3 text-right">
                                        {isEditing && editingCell?.field === 'kgco2e' ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-24 bg-input border border-primary rounded px-2 py-1 text-xs font-mono-nums text-foreground focus:outline-none text-right"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') commitEdit(rec);
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                />
                                                <button onClick={() => commitEdit(rec)} className="text-success hover:text-success/80">
                                                    <Check size={12} />
                                                </button>
                                                <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className={`text-xs font-mono-nums font-semibold text-foreground ${canEdit ? 'cursor-pointer hover:text-primary group' : ''}`}
                                                onClick={() => canEdit && startEdit(rec, 'kgco2e', String(rec.kgco2e))}
                                                title={canEdit ? 'Click to edit kgCO₂e' : undefined}
                                            >
                                                {rec.kgco2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                                {canEdit && (
                                                    <Pencil size={9} className="inline ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                                                )}
                                            </span>
                                        )}
                                    </td>

                                    {/* Activity value */}
                                    <td className="px-3 py-3 text-right">
                                        <span className="text-xs font-mono-nums text-muted-foreground">
                                            {rec.activityValue.toLocaleString()}{' '}
                                            <span className="text-2xs">{rec.unit}</span>
                                        </span>
                                    </td>

                                    {/* EF Source */}
                                    <td className="px-3 py-3">
                                        <span className="text-2xs font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border">
                                            {rec.emissionFactorSource}
                                        </span>
                                    </td>

                                    {/* Period */}
                                    <td className="px-3 py-3">
                                        <span className="text-2xs font-mono-nums text-muted-foreground">
                                            {rec.periodStart}
                                        </span>
                                    </td>

                                    {/* Confidence */}
                                    <td className="px-3 py-3">
                                        <ConfidenceBar score={rec.confidenceScore} />
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-3">
                                        <StatusBadge status={rec.reviewStatus} />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setDetailRecord(rec)}
                                                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                title="View full record details"
                                            >
                                                <Eye size={13} />
                                            </button>
                                            {rec.reviewStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => onRecordUpdate({ ...rec, reviewStatus: 'approved' })}
                                                        className="p-1.5 rounded text-muted-foreground hover:text-success hover:bg-success/10 transition-colors"
                                                        title="Approve this record"
                                                    >
                                                        <Check size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => onRecordUpdate({ ...rec, reviewStatus: 'rejected' })}
                                                        className="p-1.5 rounded text-muted-foreground hover:text-alert hover:bg-alert/10 transition-colors"
                                                        title="Reject this record"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {sorted.length === 0 && (
                            <tr>
                                <td colSpan={12} className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center">
                                        <CheckSquare size={32} className="text-muted-foreground mb-3" />
                                        <p className="text-sm font-medium text-foreground mb-1">
                                            No emissions records match these filters
                                        </p>
                                        <p className="text-xs text-muted-foreground max-w-xs">
                                            Adjust the source type, scope, status, or date range filters to find the records you&apos;re looking for.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {detailRecord && (
                <RecordDetailDrawer
                    record={detailRecord}
                    onClose={() => setDetailRecord(null)}
                    onUpdate={onRecordUpdate}
                />
            )}
        </>
    );
}