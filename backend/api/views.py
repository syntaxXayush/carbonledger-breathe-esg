from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tenant, IngestionJob, EmissionsRecord
from .serializers import TenantSerializer, IngestionJobSerializer, EmissionsRecordSerializer
from .services import ingest_sap_csv

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

class IngestionJobViewSet(viewsets.ModelViewSet):
    queryset = IngestionJob.objects.all().order_by('-started_at')
    serializer_class = IngestionJobSerializer

    @action(detail=False, methods=['post'])
    def upload_sap(self, request):
        file = request.FILES.get('file')
        tenant_id = request.data.get('tenantId', 'tenant-001')
        uploaded_by = request.data.get('uploadedBy', 'system')
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = ingest_sap_csv(tenant_id, file, uploaded_by)
            serializer = self.get_serializer(job)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EmissionsRecordViewSet(viewsets.ModelViewSet):
    queryset = EmissionsRecord.objects.all().order_by('-period_start')
    serializer_class = EmissionsRecordSerializer
    filterset_fields = ['tenant', 'review_status', 'scope', 'source_type', 'job']

    @action(detail=False, methods=['post'])
    def bulk_review(self, request):
        record_ids = request.data.get('recordIds', [])
        action_type = request.data.get('action', 'approve')
        
        if not record_ids:
            return Response({'error': 'No recordIds provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        new_status = 'approved' if action_type == 'approve' else 'rejected'
        
        records = EmissionsRecord.objects.filter(id__in=record_ids)
        updated_count = records.update(review_status=new_status)
        
        return Response({'message': f'Successfully updated {updated_count} records to {new_status}'})
