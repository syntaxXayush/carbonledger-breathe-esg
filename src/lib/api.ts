// API client to connect Next.js frontend to Django REST backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
    async getRecords(params?: Record<string, string>) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        const res = await fetch(`${API_BASE_URL}/records/${query}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch records');
        const json = await res.json();
        return json.results !== undefined ? json.results : json;
    },

    async getJobs() {
        const res = await fetch(`${API_BASE_URL}/jobs/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const json = await res.json();
        return json.results !== undefined ? json.results : json;
    },

    async uploadSAP(file: File, tenantId: string, uploadedBy: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenantId', tenantId);
        formData.append('uploadedBy', uploadedBy);

        const res = await fetch(`${API_BASE_URL}/jobs/upload_sap/`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload SAP file');
        return res.json();
    },

    async bulkReview(recordIds: string[], action: 'approve' | 'reject') {
        const res = await fetch(`${API_BASE_URL}/records/bulk_review/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recordIds, action }),
        });
        if (!res.ok) throw new Error('Failed to bulk review records');
        return res.json();
    }
};
