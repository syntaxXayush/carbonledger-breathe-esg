from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, IngestionJobViewSet, EmissionsRecordViewSet

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'jobs', IngestionJobViewSet)
router.register(r'records', EmissionsRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
