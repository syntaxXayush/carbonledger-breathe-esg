'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const EmissionsTrendChart = dynamic(
    () => import('./EmissionsTrendChart'),
    { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-lg h-[280px] w-full" /> }
);

const ScopeDonutChart = dynamic(
    () => import('./ScopeDonutChart'),
    { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-lg h-[280px] w-full" /> }
);

export default function OverviewChartsRow() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
            <div className="lg:col-span-2 card-elevated p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            12-Week Emissions Trend
                        </h2>
                        <p className="text-2xs text-muted-foreground mt-0.5">
                            kgCO₂e by scope · W08 – W19 2026
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-0.5 bg-scope1 rounded" />
                            <span className="text-2xs text-muted-foreground">Scope 1</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-0.5 bg-scope2 rounded" />
                            <span className="text-2xs text-muted-foreground">Scope 2</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-0.5 bg-scope3 rounded" />
                            <span className="text-2xs text-muted-foreground">Scope 3</span>
                        </div>
                    </div>
                </div>
                <EmissionsTrendChart />
            </div>

            <div className="lg:col-span-1 card-elevated p-5">
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-foreground">
                        Scope Breakdown
                    </h2>
                    <p className="text-2xs text-muted-foreground mt-0.5">
                        % of total kgCO₂e · Apr 2026
                    </p>
                </div>
                <ScopeDonutChart />
            </div>
        </div>
    );
}