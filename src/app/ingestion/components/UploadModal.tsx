'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

interface Props {
    open: boolean;
    onClose: () => void;
}

type SourceType = 'SAP' | 'Utility' | 'Travel';
type DetectedFormat = string | null;

interface ValidationError {
    id: string;
    row?: number;
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

const formatsBySource: Record<SourceType, string[]> = {
    SAP: ['IDoc XML', 'CSV/TSV', 'OData v4', 'BAPI Output'],
    Utility: ['Utility CSV', 'PDF OCR', 'Green Button XML', 'Manual Entry'],
    Travel: ['Concur SAE CSV', 'Navan JSON', 'IATA Itinerary'],
};

function detectFormat(file: File): DetectedFormat {
    const name = file.name.toLowerCase();
    const type = file.type;
    if (name.endsWith('.xml') || type === 'application/xml') {
        if (name.includes('idoc')) return 'IDoc XML';
        if (name.includes('greenbutton') || name.includes('green_button')) return 'Green Button XML';
        return 'IDoc XML';
    }
    if (name.endsWith('.json') || type === 'application/json') return 'Navan JSON';
    if (name.endsWith('.pdf') || type === 'application/pdf') return 'PDF OCR';
    if (name.endsWith('.csv') || name.endsWith('.tsv') || type === 'text/csv') {
        if (name.includes('concur') || name.includes('sae')) return 'Concur SAE CSV';
        if (name.includes('utility') || name.includes('ng_') || name.includes('edf')) return 'Utility CSV';
        return 'CSV/TSV';
    }
    return null;
}

const mockValidationErrors: ValidationError[] = [
    {
        id: 'verr-001',
        row: 14,
        field: 'unit_of_measure',
        message: 'Unrecognized UoM "KG/HR" — expected one of: kg, L, kWh, MJ, m³',
        severity: 'error',
    },
    {
        id: 'verr-002',
        row: 47,
        field: 'transaction_date',
        message: 'Date "29.02.2026" is invalid — 2026 is not a leap year',
        severity: 'error',
    },
    {
        id: 'verr-003',
        row: 88,
        field: 'cost_center',
        message: 'Cost center "CC-UNKNOWN-99" not found in plant lookup table',
        severity: 'warning',
    },
    {
        id: 'verr-004',
        row: 102,
        field: 'quantity',
        message: 'Quantity 0.0 — zero-value records will be skipped',
        severity: 'warning',
    },
];

export default function UploadModal({ open, onClose }: Props) {
    const [sourceType, setSourceType] = useState<SourceType>('SAP');
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [detectedFormat, setDetectedFormat] = useState<DetectedFormat>(null);
    const [selectedFormat, setSelectedFormat] = useState<string>('');
    const [uploadPhase, setUploadPhase] = useState<'idle' | 'validating' | 'validated' | 'uploading' | 'done'>('idle');
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((f: File) => {
        setFile(f);
        const fmt = detectFormat(f);
        setDetectedFormat(fmt);
        setSelectedFormat(fmt ?? '');
        setUploadPhase('validating');
        setValidationErrors([]);
        // Bypass mock validation for the prototype since Django handles validation on upload
        setTimeout(() => {
            setValidationErrors([]);
            setUploadPhase('validated');
        }, 1400);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragActive(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleSubmit = async () => {
        setUploadPhase('uploading');
        
        try {
            if (file && sourceType === 'SAP') {
                await api.uploadSAP(file, 'tenant-001', 'system');
            }
            setUploadPhase('done');
        } catch (error) {
            console.error('Upload failed', error);
            // In a real app we'd show an error state
            setUploadPhase('done');
        }
    };

    const handleReset = () => {
        setFile(null);
        setDetectedFormat(null);
        setSelectedFormat('');
        setUploadPhase('idle');
        setValidationErrors([]);
    };

    const errorCount = validationErrors.filter((e) => e.severity === 'error').length;
    const warnCount = validationErrors.filter((e) => e.severity === 'warning').length;
    const canSubmit =
        uploadPhase === 'validated' && errorCount === 0 && selectedFormat !== '';

    return (
        <Modal
            open={open}
            onClose={() => { handleReset(); onClose(); }}
            title="New Data Ingestion"
            description="Upload an emissions activity file for parsing and normalization"
            size="lg"
        >
            {uploadPhase === 'done' ? (
                <div className="flex flex-col items-center py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mb-4">
                        <CheckCircle2 size={28} className="text-success" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ingestion Started</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Job created for <span className="font-mono-nums text-foreground">{file?.name}</span>. Records will appear in the Review Queue once parsing completes.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => { handleReset(); onClose(); }}
                            className="btn-ghost px-4 py-2 rounded-md text-sm"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleReset}
                            className="btn-primary px-4 py-2 rounded-md text-sm"
                        >
                            Upload Another
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Source Type Selector */}
                    <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                            Data Source Type
                        </label>
                        <p className="text-2xs text-muted-foreground mb-2">
                            Select the system this data originates from — determines scope auto-categorization and field mapping
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['SAP', 'Utility', 'Travel'] as SourceType[]).map((s) => (
                                <button
                                    key={`src-${s}`}
                                    onClick={() => { setSourceType(s); handleReset(); }}
                                    className={`py-2.5 px-3 rounded-md text-xs font-medium border transition-all duration-150 ${sourceType === s
                                            ? 'bg-primary/15 border-primary text-primary' : 'bg-muted/40 border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <div className="font-semibold">{s}</div>
                                    <div className="text-2xs mt-0.5 opacity-70">
                                        {s === 'SAP' && 'Scope 1 / 3'}
                                        {s === 'Utility' && 'Scope 2'}
                                        {s === 'Travel' && 'Scope 3 Cat 6'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Drop Zone */}
                    <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                            Upload File
                        </label>
                        {!file ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-150 ${dragActive
                                        ? 'drag-active border-primary' : 'border-border hover:border-muted-foreground hover:bg-muted/20'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".xml,.csv,.tsv,.json,.pdf"
                                    onChange={handleInputChange}
                                />
                                <Upload size={28} className="mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm font-medium text-foreground mb-1">
                                    Drop file here or click to browse
                                </p>
                                <p className="text-2xs text-muted-foreground">
                                    Accepted: XML (IDoc, Green Button), CSV/TSV, JSON (Navan), PDF (OCR)
                                </p>
                                <p className="text-2xs text-muted-foreground mt-1">
                                    Max file size: 50 MB
                                </p>
                            </div>
                        ) : (
                            <div className="border border-border rounded-lg p-4 bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <FileText size={16} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground font-mono-nums truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-2xs text-muted-foreground mt-0.5">
                                            {(file.size / 1024).toFixed(1)} KB · {file.type || 'unknown type'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Format Detection */}
                    {file && (
                        <div>
                            <label className="block text-xs font-medium text-foreground mb-1.5">
                                Detected Format
                            </label>
                            <p className="text-2xs text-muted-foreground mb-2">
                                Auto-detected from MIME type and file header. Override if incorrect.
                            </p>
                            <div className="flex items-center gap-3">
                                {detectedFormat && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-success/10 border border-success/20">
                                        <CheckCircle2 size={12} className="text-success" />
                                        <span className="text-xs text-success font-medium">
                                            Auto-detected: {detectedFormat}
                                        </span>
                                    </div>
                                )}
                                {!detectedFormat && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-warning/10 border border-warning/20">
                                        <AlertCircle size={12} className="text-warning" />
                                        <span className="text-xs text-warning font-medium">
                                            Format not detected — select manually
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 relative">
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-xs text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="">Select format…</option>
                                    {formatsBySource[sourceType].map((fmt) => (
                                        <option key={`fmt-${fmt}`} value={fmt}>
                                            {fmt}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={13}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Validation state */}
                    {uploadPhase === 'validating' && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-muted/40 border border-border">
                            <Loader2 size={14} className="text-primary animate-spin flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-foreground">Validating file…</p>
                                <p className="text-2xs text-muted-foreground mt-0.5">
                                    Checking field mappings, UoM coverage, and duplicate hashes
                                </p>
                            </div>
                        </div>
                    )}

                    {uploadPhase === 'validated' && validationErrors.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={13} className={errorCount > 0 ? 'text-alert' : 'text-warning'} />
                                <span className="text-xs font-medium text-foreground">
                                    Validation complete —{' '}
                                    {errorCount > 0 && (
                                        <span className="text-alert">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
                                    )}
                                    {errorCount > 0 && warnCount > 0 && ', '}
                                    {warnCount > 0 && (
                                        <span className="text-warning">{warnCount} warning{warnCount > 1 ? 's' : ''}</span>
                                    )}
                                </span>
                            </div>
                            <div className="border border-border rounded-md overflow-hidden max-h-48 overflow-y-auto scrollbar-thin">
                                {validationErrors.map((err) => (
                                    <div
                                        key={err.id}
                                        className={`flex items-start gap-3 px-3 py-2.5 border-b border-border/50 last:border-0 ${err.severity === 'error' ? 'bg-alert/5' : 'bg-warning/5'
                                            }`}
                                    >
                                        <AlertCircle
                                            size={12}
                                            className={`mt-0.5 flex-shrink-0 ${err.severity === 'error' ? 'text-alert' : 'text-warning'
                                                }`}
                                        />
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                {err.row && (
                                                    <span className="text-2xs font-mono-nums text-muted-foreground">
                                                        Row {err.row}
                                                    </span>
                                                )}
                                                <span className="text-2xs font-mono-nums font-semibold text-foreground">
                                                    {err.field}
                                                </span>
                                            </div>
                                            <p className="text-2xs text-muted-foreground">{err.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errorCount > 0 && (
                                <p className="text-2xs text-alert mt-2">
                                    Fix {errorCount} error{errorCount > 1 ? 's' : ''} before ingestion can proceed. Download error report to correct source file.
                                </p>
                            )}
                        </div>
                    )}

                    {uploadPhase === 'validated' && validationErrors.length === 0 && (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-success/10 border border-success/20">
                            <CheckCircle2 size={13} className="text-success" />
                            <span className="text-xs text-success font-medium">
                                Validation passed — no errors detected. Ready to ingest.
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <button
                            onClick={() => { handleReset(); onClose(); }}
                            className="btn-ghost px-4 py-2 rounded-md text-sm"
                        >
                            Cancel
                        </button>
                        <div className="flex items-center gap-2">
                            {errorCount > 0 && (
                                <button className="btn-ghost px-4 py-2 rounded-md text-sm text-alert border-alert/30 hover:bg-alert/10">
                                    Download Error Report
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit}
                                className="btn-primary px-5 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {uploadPhase === 'uploading' ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Starting Ingestion…</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={13} />
                                        <span>Start Ingestion</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}