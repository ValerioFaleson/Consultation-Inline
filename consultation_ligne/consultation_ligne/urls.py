
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('api/', include('app.urls')),
]

# Si en mode développement (DEBUG activé)
if settings.DEBUG:
    # Ajoute une URL pour servir les fichiers médias (images téléchargées)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
