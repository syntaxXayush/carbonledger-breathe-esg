import React from 'react';
import AppLayout from '@/components/AppLayout';
import OverviewHeader from './components/OverviewHeader';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import OverviewChartsRow from './components/OverviewChartsRow';
import RecentJobsFeed from './components/RecentJobsFeed';
import AnomalyAlertsPanel from './components/AnomalyAlertsPanel';

export default function OverviewPage() {
    return (
        <AppLayout>
            <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
                <OverviewHeader />
                <MetricsBentoGrid />
                <OverviewChartsRow />
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mt-5">
                    <div className="lg:col-span-2">
                        <RecentJobsFeed />
                    </div>
                    <div className="lg:col-span-1">
                        <AnomalyAlertsPanel />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}