import React from 'react';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-muted rounded-md ${className}`} />
    );
}

export function TableRowSkeleton({ cols = 8 }: { cols?: number }) {
    return (
        <tr className="border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={`skel-col-${i}`} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

export function CardSkeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`card-elevated p-5 ${className}`}>
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}