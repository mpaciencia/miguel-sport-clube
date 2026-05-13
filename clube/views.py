from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import Jogador, Jogo, Convocatoria, Estatistica, ClassificacaoEquipa
from .serializers import (
    JogadorSerializer,
    JogoSerializer,
    ConvocatoriaSerializer,
    EstatisticaSerializer,
    ClassificacaoSerializer,
)


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def jogadores(request):
    if request.method == 'GET':
        jogador_list = Jogador.objects.all()
        serializer = JogadorSerializer(jogador_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # O pedido pode vir como multipart/form-data (quando inclui foto)
        # ou como JSON (quando não inclui foto). Ambos são suportados pelos parsers.
        serializer = JogadorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def jogador_detail(request, jogador_id):
    try:
        jogador = Jogador.objects.get(pk=jogador_id)
    except Jogador.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JogadorSerializer(jogador)
        return Response(serializer.data)

    if request.method == 'PUT':
        # partial=True permite atualizar apenas alguns campos (ex: só a foto)
        serializer = JogadorSerializer(jogador, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    jogador.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def jogos_list(request):
    if request.method == 'GET':
        jogos = Jogo.objects.all().order_by('data')
        serializer = JogoSerializer(jogos, many=True)
        return Response(serializer.data)

    if not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
    serializer = JogoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def jogo_detail(request, pk):
    try:
        jogo = Jogo.objects.get(pk=pk)
    except Jogo.DoesNotExist:
        return Response({'msg': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(JogoSerializer(jogo).data)

    if not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
    serializer = JogoSerializer(jogo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def convocatorias_list(request):
    if request.method == 'GET':
        jogo_id = request.query_params.get('jogo')
        jogador_id = request.query_params.get('jogador')
        qs = Convocatoria.objects.all()
        if jogo_id:
            qs = qs.filter(jogo=jogo_id)
        if jogador_id:
            qs = qs.filter(jogador=jogador_id)
        return Response(ConvocatoriaSerializer(qs, many=True).data)

    if not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
    serializer = ConvocatoriaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def convocatoria_detail(request, pk):
    try:
        convocatoria = Convocatoria.objects.get(pk=pk)
    except Convocatoria.DoesNotExist:
        return Response({'msg': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
    convocatoria.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def estatisticas_list(request):
    if request.method == 'GET':
        jogador_id = request.query_params.get('jogador')
        jogo_id = request.query_params.get('jogo')
        qs = Estatistica.objects.all()
        if jogador_id:
            qs = qs.filter(jogador=jogador_id)
        if jogo_id:
            qs = qs.filter(jogo=jogo_id)
        return Response(EstatisticaSerializer(qs, many=True).data)

    if not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
    serializer = EstatisticaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def classificacao_list(request):
    equipas = ClassificacaoEquipa.objects.all()
    serializer = ClassificacaoSerializer(equipas, many=True)
    return Response(serializer.data)