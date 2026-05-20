from django.contrib import admin
from .models import Jogador, Jogo, Convocatoria, Estatistica, ClassificacaoEquipa, Treino, Presenca

admin.site.register(ClassificacaoEquipa)
admin.site.register(Jogador)
admin.site.register(Jogo)
admin.site.register(Convocatoria)
admin.site.register(Estatistica)
admin.site.register(Presenca)
admin.site.register(Treino)