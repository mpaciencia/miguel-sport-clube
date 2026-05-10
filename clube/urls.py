from django.urls import path
from . import views

urlpatterns = [
    path('api/jogos/', views.jogos_list),
    path('api/jogos/<int:pk>/', views.jogo_detail),
    path('api/convocatorias/', views.convocatorias_list),
    path('api/convocatorias/<int:pk>/', views.convocatoria_detail),
    path('api/estatisticas/', views.estatisticas_list),
    path('api/classificacao/', views.classificacao_list),
]