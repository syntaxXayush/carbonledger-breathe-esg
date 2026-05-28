# Decisions

This document outlines key decisions made during the architecture and implementation of the CarbonLedger prototype.

## 1. Using Next.js (Frontend) + Django REST (Backend)
**Ambiguity:** The assignment required "Django REST + React". While Next.js is technically React, it serves as a full-stack framework on its own. 
**Decision:** We maintained Next.js as a pure frontend UI layer (using App Router's Client Components) and built a traditional Django REST API backend to handle data ingestion and persistence.
**Why:** Django excels at complex relational data modeling and admin tools, which is perfect for enterprise data like emissions. Next.js provides a vastly superior UX with Tailwind CSS and Radix/Lucide components.

## 2. Ingestion Parsing Strategy
**Ambiguity:** Which subset of the three sources (SAP, Utility, Travel) should the prototype support?
**Decision:** 
- **SAP:** Supported standard CSV flat file exports. We ignored complex IDoc XML parsing due to its highly specialized nature and reliance on specific SAP setups.
- **Utility:** Supported CSV portal exports. Ignored PDF OCR because robust OCR requires third-party ML services (like AWS Textract or DocumentAI) which are out of scope for a 4-day prototype.
- **Travel:** Supported structured JSON (e.g., from Navan webhooks).

## 3. Data Normalization
**Ambiguity:** Different sources use different units (Liters, kWh, km).
**Decision:** We implemented a dual-field approach (`activity_value` / `unit` AND `normalized_value` / `normalized_unit`).
**Why:** The Analyst must see the *original* value from the source file (e.g., 48200 kWh) for auditing, but the system needs a standard unit (e.g., MJ or kgCO2e directly) to apply standard emission factors correctly. 

## 4. What would I ask the PM?
If given the chance, I would ask the PM:
1. **Handling Updates:** If an SAP export is re-uploaded with corrected values for the same transaction IDs, should we version the `EmissionsRecord` or simply overwrite the pending one?
2. **Audit Locking:** Once an analyst "Locks" a record, is it permanently immutable, or can an Admin unlock it if the auditor finds a discrepancy?
3. **Utility Billing Periods:** If a utility bill spans from Jan 15 to Feb 14, how do we allocate those emissions for a standard monthly report? Should we prorate by days?
