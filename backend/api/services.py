import pandas as pd
import json
from .models import Tenant, IngestionJob, EmissionsRecord
from django.utils import timezone
import uuid

def ingest_sap_csv(tenant_id, file, uploaded_by):
    tenant, _ = Tenant.objects.get_or_create(id=tenant_id, defaults={'name': 'Meridian Industrial Group'})
    job = IngestionJob.objects.create(
        tenant=tenant,
        source_id="src-sap-new",
        source_name="SAP ECC 6.0",
        source_type="SAP",
        format="CSV",
        status="running",
        file_name=file.name,
        uploaded_by=uploaded_by
    )

    try:
        df = pd.read_csv(file)
        # Expected columns for SAP mock: cost_center, material_code, quantity, unit_of_measure, transaction_date
        records = []
        for index, row in df.iterrows():
            # Mock normalization & emission factors
            qty = float(row.get('quantity', 0))
            unit = str(row.get('unit_of_measure', ''))
            
            # Simple dummy mapping
            kgco2e = qty * 0.18  # dummy factor
            
            record = EmissionsRecord(
                tenant=tenant,
                job=job,
                raw_record_id=f"sap-{uuid.uuid4()}",
                scope=1,
                category="SAP Procurement",
                source_type="SAP",
                source_format="CSV",
                activity_value=qty,
                unit=unit,
                normalized_value=qty * 3.6, # dummy
                normalized_unit="MJ",
                emission_factor=0.18,
                emission_factor_source="DEFRA",
                kgco2e=kgco2e,
                period_start=row.get('transaction_date', '2026-01-01'),
                period_end=row.get('transaction_date', '2026-01-01'),
                review_status='pending',
                confidence_score=90.0,
                is_anomalous=False,
                fields=json.loads(row.to_json())
            )
            records.append(record)
        
        EmissionsRecord.objects.bulk_create(records)
        
        job.parsed_count = len(records)
        job.record_count = len(records)
        job.status = 'completed'
        job.completed_at = timezone.now()
        job.save()
        return job

    except Exception as e:
        job.status = 'failed'
        job.error_count = 1
        job.completed_at = timezone.now()
        job.save()
        raise e
