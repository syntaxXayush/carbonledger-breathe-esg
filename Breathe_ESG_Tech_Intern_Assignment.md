# Tech Intern Assignment
## Breathe ESG

---

## Context

Breathe ESG ingests emissions and activity data from client companies. The hard part of our job isn't computing carbon, it's that every client's data lives somewhere different, in a different shape, with different gaps.

- SAP exports for fuel and procurement
- Utility bills as PDFs or portal scrapes
- Travel data from Concur or similar
- Spreadsheets a sustainability lead maintains by hand

A PM sends you this:

> "We're onboarding a new enterprise client. They've got fuel and procurement data sitting in SAP, electricity data their facilities team pulls from utility portals, and business travel data from a corporate travel platform. We need to ingest all of it, normalize it, and let our analysts review and sign off before it goes to auditors. Build a prototype in Django and React. You have 4 days."

You may use any AI tool. We expect you to. We are not evaluating typing speed. We are evaluating judgment.

---

## A Note on Quality

We don't want slop.

We've all seen what unchecked AI output looks like:

- Generic CRUD apps
- READMEs written like marketing copy
- Code that works but no one understood before it was committed
- “Best practices” copy-pasted with no thought to whether they fit the problem

Submit less, but submit work you understand and can defend.

A smaller app with a sharp data model and honest tradeoffs will beat a feature-rich app you can't explain.

If we ask:

> “Why did you do X?”

and the answer is:

> “The AI suggested it,”

that's a fail regardless of whether X was correct.

---

## What to Build

Build a **Django REST + React application** that:

1. Ingests data from three source types
2. Normalizes the data
3. Surfaces a review dashboard where an analyst can:
   - See incoming data
   - Review failed rows
   - Detect suspicious entries
   - Approve rows before they are locked for audit

### Important

We are **not** providing:

- Mock APIs
- Sample files

Part of the assignment is researching what these data sources look like in the real world.

You should:

- Research SAP export formats
- Understand utility export structures
- Read Concur/Navan API documentation
- Design for realistic data structures instead of toy examples

You may fabricate sample data after understanding realistic formats.

We will ask why your sample data looks the way it does.

---

# The Three Sources

## 1. SAP — Fuel and Procurement Data

SAP exports are not friendly.

Research what a typical export looks like:

- IDoc
- Flat file
- OData service
- BAPI

Choose one and justify it.

Expect:

- Inconsistent units
- Plant codes requiring lookup tables
- German column headers
- Difficult date formats

Decide what subset of SAP complexity your system will support.

---

## 2. Utility Data — Electricity

Choose how facilities teams typically receive electricity data:

- Portal CSV export
- PDF bill
- Utility API

Pick one mode and justify your decision.

Your solution should account for:

- Meter reading units
- Tariff structures
- Billing periods that do not align with calendar months

---

## 3. Corporate Travel — Flights, Hotels, Ground Transport

Research how platforms such as:

- Concur
- Navan

expose travel data.

Consider:

- Different categories imply different emission factors
- Distances may not be provided
- Sometimes only airport codes are available

For each source, choose an ingestion mechanism such as:

- File upload
- API pull
- Manual paste

Justify why it fits the real-world scenario.

---

# Deliverables

## 1. Working App (Mandatory Deployment)

Deploy your application using a provider such as:

- Render
- Railway
- Fly.io

Local-only submissions will **not** be reviewed.

Include the live deployment URL in your submission email.

---

## 2. `MODEL.md`

Describe your:

- Data model
- Architectural reasoning

Your model must support:

- Multi-tenancy
- Scope 1 / 2 / 3 categorization
- Source-of-truth tracking
- Unit normalization
- Audit trails

This document carries significant evaluation weight.

---

## 3. `DECISIONS.md`

Document:

- Every ambiguity you resolved
- What choices you made
- Why you made them
- What you would ask the PM if given the chance

Include:

- Which subset of each source you handled
- What you intentionally ignored

---

## 4. `TRADEOFFS.md`

Describe **three things** you deliberately chose **not** to build and explain why.

---

## 5. `SOURCES.md`

For each of the three sources:

- What real-world format you researched
- What you learned
- What your sample data looks like and why
- What would fail in a real deployment

---

# Submission and Access

Reply to the assignment email with:

- GitHub repository link
- Deployed application URL
- Any credentials required to log in

Share your repository (private is fine) with:

- saurav@breatheesg.com
- rahul@breatheesg.com
- shivang@breatheesg.com

---

# Evaluation Criteria

| Criteria | Weight |
|---|---|
| Data model quality | 35% |
| Defense of decisions | 25% |
| Realistic source handling | 20% |
| Analyst UX | 10% |
| What you chose not to build | 10% |

---

## Closing Note

Good luck. We're looking forward to seeing how you think.
