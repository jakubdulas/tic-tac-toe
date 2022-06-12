from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import GameSerializer, RegistrationSerializer, GameListSerializer
from .models import Game
from rest_framework.authtoken.models import Token
from django.db.models import Q
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
import string, random
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
        })

@api_view(['POST'])
def register(request):
    serializer = RegistrationSerializer(data=request.data)
    data = {}
    serializer.is_valid(raise_exception=True)
    account = serializer.save()
    token = Token.objects.get(user=account).key
    data['username'] = account.username
    data['token'] = token
    return Response(data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response()

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def index(request):
    user = request.user

    return Response()

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_game(request):
    data = request.data
    data['creator'] = request.user.id
    data['access_code'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 6)) 

    serializer = GameSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'access_code': serializer.data['access_code']})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def join_the_game(request):
    qs = Game.objects.filter(is_private=False, opponent=None).all()
    serializer = GameListSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def game(request):
    access_code = request.data['access_code']
    game = Game.objects.get(access_code=access_code)
    data = {}

    if game.creator == request.user:
        data['symbol'] = 'O'
    else:
        data['symbol'] = 'X'
        game.opponent = request.user
        game.save()

    data['host'] = game.creator.username
    data['guest'] = game.opponent.username if game.opponent else None

    # if game.opponent:
    #     qs = Game.objects.filter(
    #         (Q(creator=game.creator) & Q(opponent=game.opponent)) | (Q(creator=game.opponent) & Q(opponent=game.creator)))
        
    #     hosts_wins = qs.filter(winner=game.creator).count()
    #     guests_wins = qs.filter(winner=game.opponent).count()

    data['score'] = game.score
    
    return Response(data)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def announce_winner(request):
    access_code = request.data['access_code']

    game = Game.objects.filter(access_code=access_code).first()
    winner = User.objects.filter(username=request.data['winner']).first()
    if not winner or not game:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    game.winner = winner
    game.save()
    data = GameSerializer(game).data
    data['winner'] = game.winner.username
    data['opponent'] = game.opponent.username
    data['creator'] = game.creator.username
    return Response(data)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def surrender(request):
    access_code = request.data['access_code']
    game = Game.objects.filter(access_code=access_code).first()
    if not game:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    winner = game.opponent if game.creator == request.user else game.creator
    game.winner = winner
    game.save()
    data = GameSerializer(game).data
    data['winner'] = game.winner.username
    data['opponent'] = game.opponent.username
    data['creator'] = game.creator.username
    return Response(data)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def play_again(request):
    data = request.data
    if data['playAgainCount'] == 2:
        game = Game.objects.create(
            creator = request.user,
            is_private = True,
            access_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 6)),
        )
        return Response({"access_code": game.access_code})
    
    game = Game.objects.filter(is_private=False, opponent=None).first()
    if game:
        return Response({"type": 'join-the-game', "access_code": game.access_code})
    return Response({"type": "create-new-game"})
