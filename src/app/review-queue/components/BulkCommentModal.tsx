'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Props {
    action: 'approve' | 'reject';
    count: number;
    onConfirm: (comment: string) => void;
    onClose: () => void;
}

interface FormValues {
    comment: string;
}

export default function BulkCommentModal({ action, count, onConfirm, onClose }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        setSubmitting(true);
        // Backend integration point: PATCH /api/emissions-records/bulk { action, comment, actor_id, ip_address }
        setTimeout(() => {
            onConfirm(data.comment);
            setSubmitting(false);
        }, 600);
    };

    const isApprove = action === 'approve';

    return (
        <Modal
            open
            onClose={onClose}
            title={isApprove ? `Approve ${count} Records` : `Reject ${count} Records`}
            description="A comment is required for audit trail compliance"
            size="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div
                    className={`flex items-start gap-3 p-3 rounded-md ${isApprove ? 'bg-success/10 border border-success/20' : 'bg-alert/10 border border-alert/20'
                        }`}
                >
                    {isApprove ? (
                        <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle size={16} className="text-alert mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <p className={`text-xs font-semibold ${isApprove ? 'text-success' : 'text-alert'}`}>
                            {isApprove
                                ? `Approving ${count} emissions record${count > 1 ? 's' : ''}`
                                : `Rejecting ${count} emissions record${count > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-2xs text-muted-foreground mt-0.5">
                            {isApprove
                                ? 'Approved records will be available for audit lock. This action is logged.'
                                : 'Rejected records will be returned to the source team for correction. This action is logged.'}
                        </p>
                    </div>
                </div>

                {!isApprove && (
                    <div className="flex items-start gap-2 p-2.5 rounded-md bg-warning/10 border border-warning/20">
                        <AlertTriangle size={13} className="text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-2xs text-warning">
                            Rejection reason will be stored in the audit log and visible to the data owner.
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                        {isApprove ? 'Approval Comment' : 'Rejection Reason'}{' '}
                        <span className="text-alert">*</span>
                    </label>
                    <p className="text-2xs text-muted-foreground mb-1.5">
                        {isApprove
                            ? 'Confirm data has been reviewed and values are accurate' : 'Explain why these records are being rejected so the source team can correct them'}
                    </p>
                    <textarea
                        {...register('comment', {
                            required: 'A comment is required for audit compliance',
                            minLength: { value: 10, message: 'Comment must be at least 10 characters' },
                        })}
                        rows={3}
                        placeholder={
                            isApprove
                                ? 'e.g. "Reviewed against SAP source — values confirmed accurate for Apr 2026"'
                                : 'e.g. "Unit of measure inconsistency — diesel recorded as kWh instead of litres"'
                        }
                        className="w-full bg-input border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                    {errors.comment && (
                        <p className="text-2xs text-alert mt-1">{errors.comment.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-ghost px-4 py-2 rounded-md text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isApprove
                                ? 'bg-success/20 text-success border border-success/30 hover:bg-success/30' : 'bg-alert/20 text-alert border border-alert/30 hover:bg-alert/30'
                            }`}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing…
                            </span>
                        ) : isApprove ? (
                            <>
                                <CheckCircle2 size={14} />
                                Confirm Approval
                            </>
                        ) : (
                            <>
                                <XCircle size={14} />
                                Confirm Rejection
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}