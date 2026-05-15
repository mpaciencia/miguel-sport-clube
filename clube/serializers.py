from rest_framework import serializers

from .models import Jogador, Jogo, Convocatoria, Estatistica, ClassificacaoEquipa, Treino


class JogadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jogador
        fields = ('id', 'nome', 'numero_camisola', 'posicao', 'data_nascimento', 'foto')


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
    class Meta:
        model = Convocatoria
        fields = ('id', 'jogo', 'jogador')


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