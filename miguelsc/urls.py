from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('clube.urls')),
]

# Em modo DEBUG, o Django serve os ficheiros de media diretamente
# Em produção, esta responsabilidade fica do lado do servidor web (nginx, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)