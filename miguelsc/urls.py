from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('clube.urls')),
    path('clube/', include('clube.urls')),
]
