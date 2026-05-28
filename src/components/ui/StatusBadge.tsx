import React from 'react';

type StatusType =
    | 'pending' | 'approved' | 'rejected' | 'locked' | 'running' | 'failed' | 'completed' | 'flagged' | 'duplicate';

interface StatusBadgeProps {
    status: StatusType;
    size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'status-pending' },
    approved: { label: 'Approved', className: 'status-approved' },
    rejected: { label: 'Rejected', className: 'status-rejected' },
    locked: { label: 'Locked', className: 'status-locked' },
    running: { label: 'Running', className: 'status-running' },
    failed: { label: 'Failed', className: 'status-failed' },
    completed: { label: 'Completed', className: 'status-completed' },
    flagged: { label: 'Anomaly', className: 'status-failed' },
    duplicate: { label: 'Duplicate', className: 'status-pending' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const config = statusConfig[status];
    const sizeClass = size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold tracking-wide ${sizeClass} ${config.className}`}
        >
            {config.label}
        </span>
    );
}