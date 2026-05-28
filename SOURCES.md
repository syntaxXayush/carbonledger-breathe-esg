# Sources Research

## 1. SAP — Fuel and Procurement Data
**Real-World Format:** SAP ECC 6.0 and S/4HANA frequently use IDoc (Intermediate Document) XML formats or traditional Flat Files (CSV/TXT). 
**What I Learned:** SAP data is notorious for lacking standard UoM (Units of Measure). For example, diesel fuel might be tracked in liters, gallons, or metric tonnes depending on the specific plant's configuration. Furthermore, location data is often hidden behind internal `cost_center` or `plant_code` identifiers rather than explicit addresses.
**Sample Data Choice:** We opted to simulate a CSV extract from SAP representing material procurement.
**Failure Point:** In a real deployment, if a plant code `CC-DE01` is not mapped to an actual physical location in our system, we cannot determine the regional emissions factor, causing calculation failures.

## 2. Utility Data — Electricity
**Real-World Format:** Facilities teams often log into portals (like National Grid or EDF) and download billing histories in CSV format, or receive Green Button XML files.
**What I Learned:** Billing periods rarely align perfectly with calendar months. A bill might span from March 14 to April 13.
**Sample Data Choice:** We modeled standard Utility CSVs containing `kwh_consumption`, `billing_period`, and `service_address`.
**Failure Point:** Prorating consumption across months is mathematically risky if energy usage varies heavily day-by-day (e.g., manufacturing). Naively dividing the total by 30 days will skew monthly reporting.

## 3. Corporate Travel — Flights, Hotels
**Real-World Format:** Platforms like Navan provide REST APIs or JSON webhooks. Concur often provides SAE (Standard Accounting Extract) CSV files.
**What I Learned:** Travel data often lacks explicit distance metrics. For flights, we usually only get IATA origin and destination codes (e.g., LHR to JFK).
**Sample Data Choice:** We structured our travel records to include `origin_iata` and `destination_iata` and implied that distance calculation happens during ingestion via an external lookup.
**Failure Point:** If an employee books a multi-leg flight but Concur only exports the final destination, the great-circle distance calculation will underestimate the actual emissions.
