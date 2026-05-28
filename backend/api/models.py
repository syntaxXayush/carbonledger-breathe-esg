from django.db import models
from django.utils import timezone
import uuid

class Tenant(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class IngestionJob(models.Model):
    STATUS_CHOICES = [
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]

    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="jobs")
    source_id = models.CharField(max_length=100)
    source_name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=50) # 'SAP', 'Utility', 'Travel'
    format = models.CharField(max_length=50) # 'CSV/TSV', 'Utility CSV', etc.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_name = models.CharField(max_length=255)
    
    record_count = models.IntegerField(default=0)
    parsed_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    duplicate_count = models.IntegerField(default=0)
    
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_ms = models.IntegerField(null=True, blank=True)
    
    uploaded_by = models.CharField(max_length=255)
    confidence_avg = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.source_name} - {self.status}"


class EmissionsRecord(models.Model):
    SCOPE_CHOICES = [
        (1, 'Scope 1'),
        (2, 'Scope 2'),
        (3, 'Scope 3'),
    ]
    
    REVIEW_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('locked', 'Locked'),
    ]

    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    raw_record_id = models.CharField(max_length=100)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="records")
    job = models.ForeignKey(IngestionJob, on_delete=models.SET_NULL, null=True, blank=True, related_name="records")
    
    scope = models.IntegerField(choices=SCOPE_CHOICES)
    category = models.CharField(max_length=255)
    source_type = models.CharField(max_length=50)
    source_format = models.CharField(max_length=50)
    
    activity_value = models.FloatField()
    unit = models.CharField(max_length=50)
    normalized_value = models.FloatField()
    normalized_unit = models.CharField(max_length=50)
    
    emission_factor = models.FloatField()
    emission_factor_source = models.CharField(max_length=50)
    kgco2e = models.FloatField()
    
    period_start = models.DateField()
    period_end = models.DateField()
    
    review_status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES, default='pending')
    confidence_score = models.FloatField(default=0.0)
    
    is_anomalous = models.BooleanField(default=False)
    anomaly_sigma = models.FloatField(null=True, blank=True)
    is_duplicate = models.BooleanField(default=False)
    
    locked_at = models.DateTimeField(null=True, blank=True)
    locked_by = models.CharField(max_length=255, null=True, blank=True)
    
    provenance = models.JSONField(default=dict)
    fields = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.category} ({self.kgco2e} kgCO2e)"
