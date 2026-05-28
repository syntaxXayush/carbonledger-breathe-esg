import React from 'react';

interface ScopeBadgeProps {
    scope: 1 | 2 | 3;
    category?: string;
    size?: 'sm' | 'md';
}

const scopeConfig = {
    1: {
        label: 'Scope 1',
        className: 'bg-scope1 text-scope1 border border-scope1/30',
    },
    2: {
        label: 'Scope 2',
        className: 'bg-scope2 text-scope2 border border-scope2/30',
    },
    3: {
        label: 'Scope 3',
        className: 'bg-scope3 text-scope3 border border-scope3/30',
    },
};

export default function ScopeBadge({ scope, category, size = 'sm' }: ScopeBadgeProps) {
    const config = scopeConfig[scope];
    const sizeClass = size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${config.className}`}
            title={category ? `${config.label} — ${category}` : config.label}
        >
            {config.label}
        </span>
    );
}