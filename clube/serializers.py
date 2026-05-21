from rest_framework import serializers
from django.db.models import Sum

from .models import Jogador, Jogo, Convocatoria, Estatistica, ClassificacaoEquipa, Treino


class JogadorSerializer(serializers.ModelSerializer):
    golos = serializers.SerializerMethodField()
    assistencias = serializers.SerializerMethodField()

    class Meta:
        model = Jogador
        fields = ('id', 'nome', 'numero_camisola', 'posicao', 'data_nascimento', 'foto', 'golos', 'assistencias')

    def get_golos(self, obj):
        total = obj.estatisticas.aggregate(Sum('golos'))['golos__sum']
        return total if total is not None else 0

    def get_assistencias(self, obj):
        total = obj.estatisticas.aggregate(Sum('assistencias'))['assistencias__sum']
        return total if total is not None else 0


class JogoSerializer(serializers.ModelSerializer):
    resultado = serializers.SerializerMethodField()

    class Meta:
        model = Jogo
        fields = (
            'id',
            'adversario',
            'data',
            'local',
            'is_casa',
            'golos_nos',
            'golos_adv',
            'resultado',
        )

    def get_resultado(self, obj):
        return obj.resultado()


class ConvocatoriaSerializer(serializers.ModelSerializer):
    jogador_nome = serializers.SerializerMethodField()

    class Meta:
        model = Convocatoria
        fields = ('id', 'jogo', 'jogador', 'jogador_nome')

    def get_jogador_nome(self, obj):
        return str(obj.jogador)

class EstatisticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estatistica
        fields = ('id', 'jogo', 'jogador', 'golos', 'assistencias')


class ClassificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassificacaoEquipa
        fields = (
            'id',
            'nome',
            'jogos',
            'vitorias',
            'empates',
            'derrotas',
            'golos_marcados',
            'golos_sofridos',
            'pontos',
            'is_nos',
        )

class TreinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treino
        fields = '__all__'