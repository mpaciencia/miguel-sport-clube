from django.urls import path
from clube import views
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
    path('api/logout/', views.logout_api, name='logout_api'),
    path('api/treinos/', views.proximos_treinos, name='proximos_treinos'),
]
