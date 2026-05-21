from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token

from .models import Jogador, Jogo, Convocatoria, Estatistica, ClassificacaoEquipa, Treino, Presenca
from .serializers import (
    JogadorSerializer,
    JogoSerializer,
    ConvocatoriaSerializer,
    EstatisticaSerializer,
    ClassificacaoSerializer,
    TreinoSerializer,
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
        jogo = serializer.save()
        
        # --- ATUALIZAR CLASSIFICAÇÃO AUTOMATICAMENTE ---
        if jogo.golos_nos is not None and jogo.golos_adv is not None:
            try:
                equipa_nos = ClassificacaoEquipa.objects.filter(is_nos=True).first()
                if not equipa_nos:
                    equipa_nos = ClassificacaoEquipa.objects.create(nome="Miguel Sport Clube", is_nos=True)
                
                equipa_adv, created = ClassificacaoEquipa.objects.get_or_create(nome=jogo.adversario, defaults={'is_nos': False})
                
                # Atualizar Jogos e Golos
                equipa_nos.jogos += 1
                equipa_nos.golos_marcados += jogo.golos_nos
                equipa_nos.golos_sofridos += jogo.golos_adv
                
                equipa_adv.jogos += 1
                equipa_adv.golos_marcados += jogo.golos_adv
                equipa_adv.golos_sofridos += jogo.golos_nos
                
                # Atualizar Vitórias/Empates/Derrotas e Pontos
                if jogo.golos_nos > jogo.golos_adv:
                    equipa_nos.vitorias += 1
                    equipa_nos.pontos += 3
                    equipa_adv.derrotas += 1
                elif jogo.golos_nos < jogo.golos_adv:
                    equipa_nos.derrotas += 1
                    equipa_adv.vitorias += 1
                    equipa_adv.pontos += 3
                else:
                    equipa_nos.empates += 1
                    equipa_nos.pontos += 1
                    equipa_adv.empates += 1
                    equipa_adv.pontos += 1
                    
                equipa_nos.save()
                equipa_adv.save()
            except Exception as e:
                print("Erro ao atualizar classificacao:", e)
                
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

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_api(request):

    #react envia dados
    username = request.data.get('username')
    password = request.data.get('password')

    #verifica se existe user
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        get_token(request)

        #devolver msg ao react em json
        return Response({
            "mensagem": "Login feito com sucesso.",
            "username": user.username,
            "is_staff": user.is_staff
        })
    else:
        return Response({"erro":"username ou password incorretos." }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def logout_api(request):
    logout(request)
    return Response({"Logout feito com sucesso." }, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def proximos_treinos(request):
    if request.method == 'GET':
        # vai à bd buscar tds os treinos
        treinos = Treino.objects.all().order_by('data')
        resultado=[]

        for treino in treinos:
            presencas = Presenca.objects.filter(treino=treino)

            vao = [p.jogador.username for p in presencas if p.confirmacao == True]
            n_vao = [p.jogador.username for p in presencas if p.confirmacao == False]

            dados_treino = {
                "id": treino.id,
                "data": treino.data,
                "hora": treino.hora,
                "local": treino.local,
                "confirmados": vao,
                "ausentes": n_vao
            }
            resultado.append(dados_treino)

        # devolve a resposta para o react
        return Response(resultado)

    elif request.method == 'POST':
        if not request.user.is_staff:
            return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)
        serializer = TreinoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def responder_presenca(request):
    # dados enviados
    id_do_treino = request.data.get('id_treino')
    vou_ao_treino = request.data.get('presenteTreino')
    username_recebido = request.data.get('username')

    # encontrar treino na bd
    try:
        jogador_logado = User.objects.get(username=username_recebido)
    except Treino.DoesNotExist:
        return Response({"message": "Treino não encontrado"})

    try:
        treino = Treino.objects.get(id=id_do_treino)
    except Treino.DoesNotExist:
        return Response({"message": "Treino não encontrado"})

    # jogador ja respjndeu a este treino ?
    presenca_existente = Presenca.objects.filter(treino=treino, jogador=jogador_logado).first()
    if presenca_existente is not None:
        presenca_existente.confirmacao = vou_ao_treino
        presenca_existente.save()
    else:
        Presenca.objects.create(
            treino=treino,
            jogador=jogador_logado,
            confirmacao=vou_ao_treino,
        )

    return Response({"message": "A sua resposta foi guardada com sucesso!" }, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def registar_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    codigo_acesso = request.data.get('codigo_acesso')

    CODIGO_JOGADOR = "MSC26JOG"
    CODIGO_STAFF = "MSC26STAFF"

    if not username or not password or not email or not codigo_acesso:
        return Response({"message": "Preenche os campos obrigatórios!"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"message": "Nome de utilizador já existe!"}, status=status.HTTP_400_BAD_REQUEST)

    if codigo_acesso == CODIGO_JOGADOR:
        is_staff = False
    elif codigo_acesso == CODIGO_STAFF:
        is_staff = True
    else:
        return Response({"message": "Código de acesso inválido!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        novo_user = User.objects.create_user(username=username, password=password, email=email)
        novo_user.is_staff = is_staff
        novo_user.save()

        return Response({"message": "Conta criada com sucesso!"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response({"message": "Erro ao criar conta. Tente novamente!"}, status=status.HTTP_400_BAD_REQUEST)


