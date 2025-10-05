from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz/', healthcheck, name='healthcheck'),
    path('api/calc/', include('calc.urls')),
]
