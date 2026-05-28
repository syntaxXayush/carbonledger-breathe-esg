# Tradeoffs

This document describes three things deliberately omitted from the prototype and the reasoning behind these choices.

## 1. Asynchronous Task Processing (Celery/Redis)
**What was omitted:** We process file uploads synchronously in the Django view using a blocking thread.
**Why:** Setting up Celery and Redis is overkill for a 4-day prototype and significantly complicates local setup and deployment. 
**Tradeoff:** In production, large SAP exports with 100,000+ rows would cause the HTTP request to timeout. A production system must use background workers, where the API immediately returns a `job_id` and the client polls or receives a WebSocket update upon completion.

## 2. Advanced PDF Parsing / OCR for Utility Bills
**What was omitted:** We did not implement OCR for PDF utility bills, instead opting to support CSV exports only.
**Why:** Reliable PDF scraping for tabular data is a massive undertaking. Different utility providers use completely different layouts. Trying to build a fragile Regex/PyPDF2 scraper would result in "slop". 
**Tradeoff:** By restricting to CSV, we lose the ability to serve clients who can *only* provide PDF bills, but we ensure that the data we *do* ingest is 100% accurate.

## 3. Production-Grade Database (PostgreSQL)
**What was omitted:** The prototype uses SQLite instead of PostgreSQL.
**Why:** SQLite requires zero configuration, allowing the prototype to run immediately out-of-the-box.
**Tradeoff:** SQLite cannot handle high concurrency and lacks advanced JSON querying capabilities (like `JSONB` indexing), which would be highly beneficial for our `fields` and `provenance` JSON columns. A production move to Postgres is mandatory.
