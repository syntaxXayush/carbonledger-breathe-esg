from rest_framework import serializers
from .models import Tenant, IngestionJob, EmissionsRecord

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class IngestionJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngestionJob
        fields = '__all__'

class EmissionsRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionsRecord
        fields = '__all__'
