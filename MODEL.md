# CarbonLedger Data Model

The data model is built using Django ORM and is designed to handle multi-tenancy, diverse source origins, and robust auditability for enterprise emissions data.

## 1. `Tenant` Model
- **Purpose**: Provides logical separation of data across different clients or organizational units.
- **Fields**: `id`, `name`, `created_at`.
- **Reasoning**: A fundamental requirement for B2B SaaS platforms. Every record and ingestion job is strictly tied to a `Tenant`.

## 2. `IngestionJob` Model
- **Purpose**: Acts as the source-of-truth tracker for all incoming data batches.
- **Key Fields**:
  - `tenant`, `source_type` (SAP, Utility, Travel), `format` (e.g., CSV, JSON).
  - `status` (running, completed, failed, pending).
  - `record_count`, `parsed_count`, `error_count`, `duplicate_count`.
- **Reasoning**: Emissions analysts need to know *where* data came from and *if* it parsed correctly before they can trust the output. Tracking metrics at the job level allows us to highlight failed uploads immediately.

## 3. `EmissionsRecord` Model
- **Purpose**: The normalized, standard representation of a single activity or emissions event.
- **Key Fields**:
  - `tenant`, `job` (ForeignKey to IngestionJob).
  - `scope` (1, 2, or 3), `category` (e.g., "Electricity - Market-Based").
  - `source_type`, `source_format` (e.g., SAP, IDoc XML).
  - `activity_value`, `unit`, `normalized_value`, `normalized_unit` (Crucial for normalizing diverse inputs like liters, kWh, km into standard MJ or standard units).
  - `emission_factor`, `emission_factor_source` (e.g., DEFRA, EPA).
  - `kgco2e` (The final calculated emissions).
  - `period_start`, `period_end` (Critical for utility bills spanning non-calendar months).
  - `review_status` (pending, approved, rejected, locked) - Supports the analyst review workflow.
  - `confidence_score`, `is_anomalous` - Flags for the UI to highlight suspicious entries.
  - `provenance` (JSONField) - Detailed tracking of source system, file name, payload hashes.
  - `fields` (JSONField) - Stores the raw, unstructured data from the source for analyst reference.

## Architectural Reasoning

The decision to split `IngestionJob` and `EmissionsRecord` ensures we separate the *process* of acquiring data from the *result* of the data. 

The use of JSONFields for `provenance` and `fields` gives us the flexibility to store arbitrary source data (which is highly variable between SAP, Concur, and National Grid) without needing a rigid schema for every possible column they might send, while still keeping the core fields (`kgco2e`, `scope`, `unit`) strictly typed for aggregations and filtering.
