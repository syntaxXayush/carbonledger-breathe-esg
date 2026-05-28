import React from 'react';

interface ConfidenceBarProps {
    score: number; // 0–100
    showLabel?: boolean;
}

export default function ConfidenceBar({ score, showLabel = true }: ConfidenceBarProps) {
    const colorClass =
        score >= 80
            ? 'confidence-bar-high'
            : score >= 50
                ? 'confidence-bar-medium' : 'confidence-bar-low';

    const textColor =
        score >= 80
            ? 'text-success'
            : score >= 50
                ? 'text-warning' : 'text-alert';

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
                    style={{ width: `${score}%` }}
                />
            </div>
            {showLabel && (
                <span className={`text-2xs font-mono-nums font-semibold w-7 text-right ${textColor}`}>
                    {score}%
                </span>
            )}
        </div>
    );
}