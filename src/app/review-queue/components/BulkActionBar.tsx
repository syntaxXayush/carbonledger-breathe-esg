import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface Props {
    count: number;
    onApprove: () => void;
    onReject: () => void;
    onClear: () => void;
}

export default function BulkActionBar({ count, onApprove, onReject, onClear }: Props) {
    return (
        <div className="flex items-center justify-between px-6 py-3 bg-card border-t border-primary/30 shadow-lg animate-slide-up flex-shrink-0">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary font-mono-nums">
                    {count} record{count > 1 ? 's' : ''} selected
                </span>
                <button
                    onClick={onClear}
                    className="text-2xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                    <X size={11} /> Clear selection
                </button>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onReject}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-alert/15 text-alert border border-alert/30 hover:bg-alert/25 transition-all active:scale-95"
                >
                    <XCircle size={14} />
                    Reject {count}
                </button>
                <button
                    onClick={onApprove}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-success/15 text-success border border-success/30 hover:bg-success/25 transition-all active:scale-95"
                >
                    <CheckCircle2 size={14} />
                    Approve {count}
                </button>
            </div>
        </div>
    );
}