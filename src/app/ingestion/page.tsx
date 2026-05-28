import React from 'react';
import AppLayout from '@/components/AppLayout';
import IngestionPageClient from './components/IngestionPageClient';

export default function IngestionPage() {
    return (
        <AppLayout>
            <IngestionPageClient />
        </AppLayout>
    );
}