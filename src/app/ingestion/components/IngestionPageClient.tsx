'use client';

import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import IngestionJobsTable from './IngestionJobsTable';
import UploadModal from './UploadModal';
import IngestionStatsBar from './IngestionStatsBar';

export default function IngestionPageClient() {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState<'All' | 'SAP' | 'Utility' | 'Travel'>('All');

    return (
        <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                        Data Ingestion
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload and monitor emissions data from SAP, utility providers, and corporate travel platforms
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                        <RefreshCw size={14} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setUploadOpen(true)}
                        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-md text-sm"
                    >
                        <Upload size={14} />
                        <span>New Ingestion</span>
                    </button>
                </div>
            </div>

            <IngestionStatsBar />

            {/* Source Filter Tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-border">
                {(['All', 'SAP', 'Utility', 'Travel'] as const).map((tab) => (
                    <button
                        key={`tab-${tab}`}
                        onClick={() => setSourceFilter(tab)}
                        className={`px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${sourceFilter === tab
                                ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab}
                        {tab === 'SAP' && (
                            <span className="ml-2 text-2xs font-mono-nums px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                2
                            </span>
                        )}
                        {tab === 'Utility' && (
                            <span className="ml-2 text-2xs font-mono-nums px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                2
                            </span>
                        )}
                        {tab === 'Travel' && (
                            <span className="ml-2 text-2xs font-mono-nums px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                2
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <IngestionJobsTable sourceFilter={sourceFilter} />

            <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
        </div>
    );
}