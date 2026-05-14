from django.db import models
from django.contrib.auth.models import User


class Jogador(models.Model):
    POSICAO_CHOICES = [
        ('GR', 'Guarda Redes'),
        ('FX', 'Fixo'),
        ('AL', 'Ala'),
        ('PI', 'Pivot'),
    ]

    nome = models.CharField(max_length=100)
    numero_camisola = models.PositiveIntegerField(unique=True)
    posicao = models.CharField(max_length=2, choices=POSICAO_CHOICES)
    data_nascimento = models.DateField()
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.numero_camisola} - {self.nome}"


class Jogo(models.Model):
    adversario = models.CharField(max_length=100)
    data = models.DateTimeField()
    local = models.CharField(max_length=100)
    is_casa = models.BooleanField(default=True)
    golos_nos = models.IntegerField(null=True, blank=True)
    golos_adv = models.IntegerField(null=True, blank=True)

    def resultado(self):
        if self.golos_nos is None:
            return None
        return f"{self.golos_nos} - {self.golos_adv}"

    def __str__(self):
        return f"vs {self.adversario} ({self.data.date()})"


class Convocatoria(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='convocatorias')
    jogador = models.ForeignKey(Jogador, on_delete=models.CASCADE, related_name='convocatorias')

    class Meta:
        unique_together = ('jogo', 'jogador')

    def __str__(self):
        return f"{self.jogador} convocado para {self.jogo}"


class Estatistica(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='estatisticas')
    jogador = models.ForeignKey(Jogador, on_delete=models.CASCADE, related_name='estatisticas')
    golos = models.IntegerField(default=0)
    assistencias = models.IntegerField(default=0)

    class Meta:
        unique_together = ('jogo', 'jogador')

    def __str__(self):
        return f"Stats de {self.jogador} em {self.jogo}"


class ClassificacaoEquipa(models.Model):
    nome = models.CharField(max_length=100)
    jogos = models.IntegerField(default=0)
    vitorias = models.IntegerField(default=0)
    empates = models.IntegerField(default=0)
    derrotas = models.IntegerField(default=0)
    golos_marcados = models.IntegerField(default=0)
    golos_sofridos = models.IntegerField(default=0)
    pontos = models.IntegerField(default=0)
    is_nos = models.BooleanField(default=False)

    class Meta:
        ordering = ['-pontos', '-golos_marcados']

    def __str__(self):
        return self.nome

class Treino(models.Model):
    data = models.DateField()
    hora = models.TimeField()
    local = models.CharField(max_length=100)

    def __str__(self):
        return f"Treino: {self.data} às {self.hora} em {self.local}"

class Presenca(models.Model):
    treino = models.ForeignKey(Treino, on_delete=models.CASCADE, related_name='presencas')
    jogador = models.ForeignKey(Jogador, on_delete=models.CASCADE, related_name='presencas_treino')

    confirmacao = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        status = "Pendente"
        if self.confirmacao is True:
            status = "Confirmado"
        elif self.confirmacao is False:
            status = "Ausente"

        return f"{self.jogador.nome} - {self.treino.data} ({status})"