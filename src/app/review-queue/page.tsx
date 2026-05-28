import React from 'react';
import AppLayout from '@/components/AppLayout';
import ReviewQueueClient from './components/ReviewQueueClient';

export default function ReviewQueuePage() {
    return (
        <AppLayout>
            <ReviewQueueClient />
        </AppLayout>
    );
}