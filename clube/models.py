from django.db import models


# ─────────────────────────────────────────────
# DOMÍNIO DO MANUEL
# ─────────────────────────────────────────────
class Jogador(models.Model):
    pass


# ─────────────────────────────────────────────
# DOMÍNIO DO IVO — Jogos, Convocatórias, Estatísticas
# ─────────────────────────────────────────────
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
    is_nos = models.BooleanField(default=False)  # destaca o Miguel Sport Clube

    class Meta:
        ordering = ['-pontos', '-golos_marcados']

    def __str__(self):
        return self.nome