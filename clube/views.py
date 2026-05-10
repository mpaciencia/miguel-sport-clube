from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Jogador
from .serializers import JogadorSerializer

# Create your views here.
@api_view(['GET', 'POST'])
def jogadores(request):
    if request.method == 'GET':
        jogador_list = Jogador.objects.all()
        serializer = JogadorSerializer(jogador_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = JogadorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def jogador_detail(request, jogador_id):
    try:
        jogador = Jogador.objects.get(pk=jogador_id)
    except Jogador.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = JogadorSerializer(jogador)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = JogadorSerializer(jogador, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        elif request.method == 'DELETE':
            jogador.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
