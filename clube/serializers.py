from rest_framework import serializers
from .models import Jogador

class JogadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jogador
        fields = ('id', 'nome', 'numero_camisola', 'posicao', 'data_nascimento')