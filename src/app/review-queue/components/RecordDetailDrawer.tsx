'use client';

import React, { useState } from 'react';
import {
    X,
    Lock,
    AlertTriangle,
    Copy,
    Hash,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    Shield,
} from 'lucide-react';
import { EmissionsRecord } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import ScopeBadge from '@/components/ui/ScopeBadge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';

interface Props {
    record: EmissionsRecord;
    onClose: () => void;
    onUpdate: (updated: EmissionsRecord) => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-border rounded-md overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <span className="text-xs font-semibold text-foreground">{title}</span>
                {open ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
            </button>
            {open && <div className="px-4 py-3 space-y-2">{children}</div>}
        </div>
    );
}

function FieldRow({ label, value, mono = false, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-3 py-1.5 border-b border-border/30 last:border-0">
            <span className="text-2xs text-muted-foreground flex-shrink-0 w-36">{label}</span>
            <span className={`text-xs text-right break-all ${mono ? 'font-mono-nums' : ''} ${highlight ? 'text-primary font-semibold' : 'text-foreground'}`}>
                {value}
            </span>
        </div>
    );
}

export default function RecordDetailDrawer({ record: rec, onClose, onUpdate }: Props) {
    const canAct = rec.reviewStatus === 'pending';

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto scrollbar-thin shadow-2xl animate-slide-down">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-sm font-semibold text-foreground font-mono-nums">{rec.id}</h2>
                                {rec.isAnomalous && (
                                    <span className="flex items-center gap-1 text-2xs font-mono-nums font-bold text-alert bg-alert/15 px-1.5 py-0.5 rounded border border-alert/30">
                                        <AlertTriangle size={10} /> {rec.anomalySigma?.toFixed(1)}σ
                                    </span>
                                )}
                                {rec.reviewStatus === 'locked' && (
                                    <span className="flex items-center gap-1 text-2xs text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded border border-purple-400/20">
                                        <Lock size={10} /> Locked
                                    </span>
                                )}
                            </div>
                            <p className="text-2xs text-muted-foreground">{rec.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {/* Top summary */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="card-elevated p-3 text-center">
                            <p className="text-xl font-bold font-mono-nums text-foreground">
                                {rec.kgco2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                            </p>
                            <p className="text-2xs text-muted-foreground">kgCO₂e</p>
                        </div>
                        <div className="card-elevated p-3 text-center">
                            <ScopeBadge scope={rec.scope} size="md" />
                            <p className="text-2xs text-muted-foreground mt-1">Scope</p>
                        </div>
                        <div className="card-elevated p-3 text-center">
                            <StatusBadge status={rec.reviewStatus} size="md" />
                            <p className="text-2xs text-muted-foreground mt-1">Status</p>
                        </div>
                    </div>

                    <ConfidenceBar score={rec.confidenceScore} showLabel />

                    {rec.isAnomalous && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-alert/10 border border-alert/20">
                            <AlertTriangle size={13} className="text-alert mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-alert">Anomaly Detected</p>
                                <p className="text-2xs text-muted-foreground mt-0.5">
                                    This record is {rec.anomalySigma?.toFixed(2)}σ outside the historical baseline for{' '}
                                    {rec.category}. Review the activity value and emission factor before approving.
                                </p>
                            </div>
                        </div>
                    )}

                    {rec.isDuplicate && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-warning/10 border border-warning/20">
                            <Copy size={13} className="text-warning mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-warning">Potential Duplicate</p>
                                <p className="text-2xs text-muted-foreground mt-0.5">
                                    Hash-based deduplication flagged this record as a potential duplicate of a previously ingested record with matching (source_id, period, account, quantity).
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Emissions calculation */}
                    <Section title="Emissions Calculation">
                        <FieldRow label="Activity Value" value={`${rec.activityValue.toLocaleString()} ${rec.unit}`} mono />
                        <FieldRow label="Normalized Value" value={`${rec.normalizedValue.toLocaleString()} ${rec.normalizedUnit}`} mono />
                        <FieldRow label="Emission Factor" value={`${rec.emissionFactor} kgCO₂e/${rec.normalizedUnit}`} mono />
                        <FieldRow label="EF Source" value={rec.emissionFactorSource} />
                        <FieldRow label="kgCO₂e" value={rec.kgco2e.toLocaleString(undefined, { maximumFractionDigits: 2 })} mono highlight />
                        <FieldRow label="Period" value={`${rec.periodStart} → ${rec.periodEnd}`} mono />
                    </Section>

                    {/* Source fields */}
                    <Section title="Source Record Fields">
                        {Object.entries(rec.fields).map(([k, v]) => (
                            <FieldRow key={`field-${rec.id}-${k}`} label={k.replace(/_/g, ' ')} value={v} mono />
                        ))}
                    </Section>

                    {/* Provenance */}
                    <Section title="Provenance & Source-of-Truth" defaultOpen={false}>
                        <FieldRow label="Source System" value={rec.provenance.sourceSystem} />
                        <FieldRow label="File Name" value={rec.provenance.fileName} mono />
                        <FieldRow label="Ingested At" value={new Date(rec.provenance.ingestionTimestamp).toLocaleString('en-GB')} mono />
                        <FieldRow label="Payload Hash" value={rec.provenance.payloadHash} mono />
                    </Section>

                    {/* Lock history */}
                    {rec.reviewStatus === 'locked' && (
                        <Section title="Lock History">
                            <FieldRow label="Locked At" value={new Date(rec.lockedAt!).toLocaleString('en-GB')} mono />
                            <FieldRow label="Locked By" value={rec.lockedBy!} mono />
                            <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded bg-purple-400/10 border border-purple-400/20">
                                <Shield size={12} className="text-purple-400 flex-shrink-0" />
                                <p className="text-2xs text-purple-300">
                                    This record is immutable. All fields are read-only. Unlock requires elevated admin role.
                                </p>
                            </div>
                        </Section>
                    )}

                    {/* Actions */}
                    {canAct && (
                        <div className="flex gap-2 pt-2 border-t border-border">
                            <button
                                onClick={() => { onUpdate({ ...rec, reviewStatus: 'rejected' }); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium bg-alert/15 text-alert border border-alert/30 hover:bg-alert/25 transition-all active:scale-95"
                            >
                                <XCircle size={14} /> Reject
                            </button>
                            <button
                                onClick={() => { onUpdate({ ...rec, reviewStatus: 'approved' }); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium bg-success/15 text-success border border-success/30 hover:bg-success/25 transition-all active:scale-95"
                            >
                                <CheckCircle2 size={14} /> Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}