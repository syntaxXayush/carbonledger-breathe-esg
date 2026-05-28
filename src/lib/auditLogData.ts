// Audit log mock data — replace with API calls to /api/audit-log in production

export type AuditEventType =
    | 'record_edit' | 'record_approved' | 'record_rejected' | 'source_correction' | 'bulk_approve' | 'bulk_reject' | 'record_locked' | 'emission_factor_override';

export interface FieldDiff {
    field: string;
    before: string;
    after: string;
}

export interface AuditLogEntry {
    id: string;
    eventType: AuditEventType;
    recordId: string;
    recordCategory: string;
    scope: 1 | 2 | 3;
    tenantId: string;
    tenantName: string;
    analystName: string;
    analystEmail: string;
    timestamp: string;
    comment?: string;
    diffs?: FieldDiff[];
    affectedCount?: number; // for bulk actions
    sourceSystem?: string;
    jobId?: string;
}

export const mockAuditLog: AuditLogEntry[] = [
    {
        id: 'audit-001',
        eventType: 'record_approved',
        recordId: 'rec-003',
        recordCategory: 'Electricity — Market-Based',
        scope: 2,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Priya Nair',
        analystEmail: 'priya.nair@meridian.com',
        timestamp: '2026-05-27T09:14:33Z',
        comment: 'Verified against National Grid invoice. Confidence 97%. Approved.',
    },
    {
        id: 'audit-002',
        eventType: 'record_approved',
        recordId: 'rec-004',
        recordCategory: 'Electricity — Location-Based',
        scope: 2,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Priya Nair',
        analystEmail: 'priya.nair@meridian.com',
        timestamp: '2026-05-27T09:15:01Z',
        comment: 'Dual-method electricity record. Location-based approved.',
    },
    {
        id: 'audit-003',
        eventType: 'record_edit',
        recordId: 'rec-002',
        recordCategory: 'Fuel Combustion — Diesel',
        scope: 1,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'James Kumar',
        analystEmail: 'jkumar@meridian.com',
        timestamp: '2026-05-27T10:22:47Z',
        comment: 'Corrected activity value — SAP IDoc had unit mismatch (gallons vs litres). Recalculated kgCO₂e.',
        diffs: [
            { field: 'activityValue', before: '3275', after: '12400' },
            { field: 'unit', before: 'gal', after: 'L' },
            { field: 'kgco2e', before: '8791.2', after: '33297.6' },
            { field: 'emissionFactor', before: '2.68521', after: '2.68521' },
        ],
    },
    {
        id: 'audit-004',
        eventType: 'source_correction',
        recordId: 'rec-006',
        recordCategory: 'Cat 6 — Business Travel (Air)',
        scope: 3,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Priya Nair',
        analystEmail: 'priya.nair@meridian.com',
        timestamp: '2026-05-27T11:05:18Z',
        comment: 'Concur distance calculation used straight-line. Corrected to IATA great-circle routing.',
        diffs: [
            { field: 'activityValue', before: '9840', after: '11240' },
            { field: 'kgco2e', before: '1921.6', after: '2194.7' },
            { field: 'sourceFormat', before: 'Concur SAE CSV', after: 'IATA Itinerary' },
        ],
        sourceSystem: 'Concur Travel EMEA',
        jobId: 'job-003',
    },
    {
        id: 'audit-005',
        eventType: 'record_rejected',
        recordId: 'rec-007',
        recordCategory: 'Cat 6 — Business Travel (Rail)',
        scope: 3,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Sarah Okonkwo',
        analystEmail: 's.okonkwo@meridian.com',
        timestamp: '2026-05-27T11:48:52Z',
        comment: 'Duplicate record — identical trip already ingested via Navan JSON (rec-008). Rejected.',
    },
    {
        id: 'audit-006',
        eventType: 'bulk_approve',
        recordId: 'batch-navan-001',
        recordCategory: 'Cat 6 — Business Travel (Multiple)',
        scope: 3,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Priya Nair',
        analystEmail: 'priya.nair@meridian.com',
        timestamp: '2026-05-27T12:30:00Z',
        comment: 'Bulk approved 18 Navan travel records. All confidence ≥85%, no anomalies detected.',
        affectedCount: 18,
        jobId: 'job-006',
    },
    {
        id: 'audit-007',
        eventType: 'emission_factor_override',
        recordId: 'rec-001',
        recordCategory: 'Fuel Combustion — Natural Gas',
        scope: 1,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'James Kumar',
        analystEmail: 'jkumar@meridian.com',
        timestamp: '2026-05-27T13:15:44Z',
        comment: 'Updated to DEFRA 2026 Q2 emission factor. Previous factor was 2025 vintage.',
        diffs: [
            { field: 'emissionFactor', before: '0.18216', after: '0.18316' },
            { field: 'emissionFactorSource', before: 'DEFRA 2025', after: 'DEFRA 2026 Q2' },
            { field: 'kgco2e', before: '8780.1', after: '8828.3' },
        ],
    },
    {
        id: 'audit-008',
        eventType: 'record_locked',
        recordId: 'rec-003',
        recordCategory: 'Electricity — Market-Based',
        scope: 2,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Priya Nair',
        analystEmail: 'priya.nair@meridian.com',
        timestamp: '2026-05-27T14:00:00Z',
        comment: 'Record locked for Q1 2026 reporting period. No further edits permitted.',
    },
    {
        id: 'audit-009',
        eventType: 'record_edit',
        recordId: 'rec-005',
        recordCategory: 'Cat 6 — Business Travel (Air)',
        scope: 3,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'Sarah Okonkwo',
        analystEmail: 's.okonkwo@meridian.com',
        timestamp: '2026-05-27T14:42:19Z',
        comment: 'Corrected travel class from Economy to Business. Emission factor updated accordingly.',
        diffs: [
            { field: 'travel_class', before: 'Economy', after: 'Business' },
            { field: 'emissionFactor', before: '0.15532', after: '0.24257' },
            { field: 'kgco2e', before: '748.6', after: '1169.2' },
        ],
    },
    {
        id: 'audit-010',
        eventType: 'bulk_reject',
        recordId: 'batch-sap-002',
        recordCategory: 'Fuel Combustion (Multiple)',
        scope: 1,
        tenantId: 'tenant-001',
        tenantName: 'Meridian Industrial Group',
        analystName: 'James Kumar',
        analystEmail: 'jkumar@meridian.com',
        timestamp: '2026-05-27T15:10:05Z',
        comment: 'Bulk rejected 7 SAP records from failed OData pull. Source system returned partial data.',
        affectedCount: 7,
        jobId: 'job-004',
    },
    {
        id: 'audit-011',
        eventType: 'source_correction',
        recordId: 'rec-010',
        recordCategory: 'Electricity — Market-Based',
        scope: 2,
        tenantId: 'tenant-002',
        tenantName: 'Vantage Energy Partners',
        analystName: 'Marcus Webb',
        analystEmail: 'm.webb@vantage.com',
        timestamp: '2026-05-27T16:00:22Z',
        comment: 'EDF PDF OCR misread meter reading. Corrected from scanned invoice.',
        diffs: [
            { field: 'activityValue', before: '42100', after: '42810' },
            { field: 'kgco2e', before: '9813.5', after: '9979.0' },
        ],
        sourceSystem: 'EDF Energy Portal',
        jobId: 'job-005',
    },
    {
        id: 'audit-012',
        eventType: 'record_approved',
        recordId: 'rec-011',
        recordCategory: 'Cat 1 — Purchased Goods',
        scope: 3,
        tenantId: 'tenant-002',
        tenantName: 'Vantage Energy Partners',
        analystName: 'Marcus Webb',
        analystEmail: 'm.webb@vantage.com',
        timestamp: '2026-05-27T16:45:00Z',
        comment: 'Spend-based calculation verified. EEIO factor applied correctly.',
    },
];
