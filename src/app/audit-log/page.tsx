import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuditLogClient from './components/AuditLogClient';

export const metadata = {
    title: 'Audit Log — CarbonLedger',
    description: 'Immutable audit trail of all record edits, approvals, rejections, and source corrections.',
};

export default function AuditLogPage() {
    return (
        <AppLayout>
            <div className="flex flex-col h-screen overflow-hidden">
                <AuditLogClient />
            </div>
        </AppLayout>
    );
}
