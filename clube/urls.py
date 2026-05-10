from django.urls import path
from .import views

app_name = 'clube'

urlpatterns = [
    path('api/jogadores/', views.jogadores),
    path('api/jogadores/<int:jogador_id>/', views.jogador_detail),
]