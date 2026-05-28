# 🍃 CarbonLedger — Enterprise Carbon Intelligence Platform

A full-stack emissions data ingestion and review platform built for the **Breathe ESG Technical Assessment**. Built with **Next.js 15**, **Django REST Framework**, and **Tailwind CSS**. Analysts can upload raw enterprise data (SAP, Utility), review normalized emissions records, and perform bulk approvals — all powered by a robust Python backend and a highly polished, responsive frontend.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) ![Django](https://img.shields.io/badge/Django-REST-092E20?logo=django) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript) ![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)

---

## 🚀 Live Demo

> **Frontend (Vercel)**: https://carbonledger-breathe-esg.vercel.app
> **Backend API (Render)**: https://carbonledger-breathe-esg.onrender.com/api

---

## 📋 Features

| Feature | Status | Details |
|---------|--------|---------|
| Multi-Source Ingestion | ✅ | Drag-and-drop CSV upload (simulating SAP flat files) |
| Data Normalization | ✅ | Backend automatically converts diverse units to standardized `kgco2e` |
| Review Queue | ✅ | Interactive data table to view, filter, and audit incoming records |
| Bulk Actions | ✅ | Select multiple records to Approve or Reject simultaneously |
| Anomaly Detection | ✅ | Flags records with low confidence scores for manual analyst review |
| Exceptional UI/UX | ✅ | Premium dark mode, glassmorphism, and micro-animations |
| Multi-tenancy | ✅ | Data strictly separated by `Tenant` at the database level |
| Simulated SSO | ✅ | High-end login UI demonstrating enterprise SaaS patterns |

---

## 🗂️ Project Structure

```
carbonledger/
├── backend/                          # Django REST API
│   ├── api/                          # Main application app
│   │   ├── models.py                 # Tenant, IngestionJob, EmissionsRecord
│   │   ├── serializers.py            # DRF Model Serializers
│   │   ├── views.py                  # API ViewSets & bulk actions
│   │   ├── services.py               # Pandas CSV parsing & math logic
│   │   └── urls.py                   # API routing
│   ├── carbonledger/                 # Project configuration
│   │   ├── settings.py               # Database, CORS, Installed Apps
│   │   └── urls.py                   # Root routing
│   └── manage.py
├── src/                              # Next.js App Router (Frontend)
│   ├── app/                          
│   │   ├── layout.tsx                # Root layout with Sidebar + Navbar
│   │   ├── login/page.tsx            # Simulated SSO login page
│   │   ├── ingestion/                # Data upload flow
│   │   │   ├── page.tsx              
│   │   │   └── components/           # UploadModal, JobsTable
│   │   └── review-queue/             # Analyst approval dashboard
│   │       ├── page.tsx              
│   │       └── components/           # QueueTable, BulkActionBar
│   ├── components/                   
│   │   ├── layout/Sidebar.tsx        # Global navigation
│   │   └── ui/                       # Reusable UI (Badges, Modals, Skeletons)
│   └── lib/
│       ├── api.ts                    # Fetch client for Django REST
│       └── mockData.ts               # Fallback types and interface definitions
├── public/                           # Static assets & logos
├── MODEL.md                          # Data modeling rationale
├── DECISIONS.md                      # Architecture decisions
├── TRADEOFFS.md                      # Omissions & trade-offs
└── SOURCES.md                        # Research on SAP/Utility formats
```

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd carbonledger
```

### 2. Start the Django Backend

Open a terminal and navigate to the `backend/` directory:

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 3. Start the Next.js Frontend

Open a **new** terminal in the root directory:

```bash
npm install
npm run dev
```

Open [http://localhost:4028](http://localhost:4028).

---

## 🏗️ Database Schema

```
┌──────────────┐      ┌───────────────┐      ┌──────────────────┐
│    Tenant    │      │ IngestionJob  │      │ EmissionsRecord  │
│              │      │               │      │                  │
│ id (PK, UUID)│─┐    │ id (PK, UUID) │─┐    │ id (PK, UUID)    │
│ name         │ └───<│ tenant_id (FK)│ └───<│ job_id (FK)      │
│ created_at   │      │ source_type   │      │ tenant_id (FK)   │
└──────────────┘      │ format        │      │ scope            │
                      │ status        │      │ category         │
                      │ record_count  │      │ activity_value   │
                      │ parsed_count  │      │ unit             │
                      │ error_count   │      │ kgco2e           │
                      └───────────────┘      │ review_status    │
                                             │ confidence_score │
                                             └──────────────────┘
```

### Key Security & Architecture Features

| Feature | Implementation |
|---------|---------------|
| **Decoupled Stack** | Next.js handles pure UI presentation while Django handles heavy Pandas data parsing. |
| **Multi-tenancy** | Every `IngestionJob` and `EmissionsRecord` is strictly bound to a `Tenant` via ForeignKeys. |
| **JSON Provenance** | The backend stores raw, unstructured rows in a `fields` JSON column so analysts can always audit the original data. |
| **API Pagination** | Django REST Framework handles pagination out of the box to prevent frontend memory leaks on 10k+ row uploads. |

---

## 🧪 Testing Checklist

1. **Start Servers**: Ensure Django is on `8000` and Next.js is on `4028`.
2. **Login Simulation**: Visit `/login`, see the premium UI, and click "Sign in" to test the simulated delay and routing.
3. **Upload Data**: Go to **Data Ingestion** → Upload Data. Use the `sample_sap_data.csv` provided in the root folder.
4. **Verify Processing**: Watch the job appear in the Recent Jobs table.
5. **Review Queue**: Navigate to **Review Queue**. Verify the newly parsed records appear.
6. **Bulk Actions**: Select 2 rows, click "Approve", and type an audit comment. Verify the API successfully updates the database and the UI reflects the new "Approved" status badges.

---

## 🏛️ Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js over CRA/Vite | Provides superior routing (App Router), highly optimized production builds, and a better foundation for enterprise UI. |
| Django over Node/Express | Python's `pandas` ecosystem is infinitely superior for parsing messy CSV/Excel enterprise data than JavaScript. |
| SQLite | Chosen strictly for the prototype to ensure zero-configuration setup for reviewers. Must be swapped for PostgreSQL in production. |
| Two-Field Unit Tracking | We store both `activity_value` (original) and `kgco2e` (normalized) because auditors require the original source numbers for compliance checks. |

---

## 🚧 Trade-offs & What I'd Do Differently

1. **Asynchronous Processing**: Uploads are processed synchronously. For a production app handling 100MB SAP exports, I would offload parsing to **Celery + Redis** and use WebSockets for real-time progress bars.
2. **Database Choice**: I would migrate from SQLite to PostgreSQL to leverage `JSONB` indexing for the raw data fields.
3. **Authentication**: Replace the simulated login page with NextAuth.js or Supabase Auth connected to the Django backend.
4. **OCR Pipeline**: PDF Utility bills were omitted. In the future, integrating AWS Textract would allow us to parse PDF utility statements.

---

## 📄 License

This project was built as a technical assignment submission for Breathe ESG.
