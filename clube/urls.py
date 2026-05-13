from django.urls import path

from . import views
from .import views

app_name = 'clube'

urlpatterns = [
    path('api/jogadores/', views.jogadores),
    path('api/jogadores/<int:jogador_id>/', views.jogador_detail),
    path('api/jogos/', views.jogos_list),
    path('api/jogos/<int:pk>/', views.jogo_detail),
    path('api/convocatorias/', views.convocatorias_list),
    path('api/convocatorias/<int:pk>/', views.convocatoria_detail),
    path('api/estatisticas/', views.estatisticas_list),
    path('api/classificacao/', views.classificacao_list),
    path('api/login/', views.login_api, name='login_api'),
]
