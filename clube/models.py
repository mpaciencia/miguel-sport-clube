from django.db import models

# Create your models here.

class Jogador(models.Model):
    POSICAO_CHOICES = [
        ('GR','Guarda Redes'),
        ('FX','Fixo'),
        ('AL','Ala'),
        ('PI','Pivot'),
    ]

    nome = models.CharField(max_length=100)
    numero_camisola = models.PositiveIntegerField(unique=True)
    posicao = models.CharField(max_length=2, choices=POSICAO_CHOICES)
    data_nascimento = models.DateField()
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.numero_camisola} - {self.nome}"