from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView  # <--- Adicione isso
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from accounts.views import UserViewSet
from warehouse.views import CategoriaViewSet, ItemViewSet, TransacaoViewSet, dashboard_stats, analise_ia

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'itens', ItemViewSet)
router.register(r'transacoes', TransacaoViewSet)

urlpatterns = [
    path('', RedirectView.as_view(url='/api/docs/', permanent=False)),

    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('api/dashboard/ia-analysis/', analise_ia, name='ia-analysis'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]