from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Game
from rest_framework.authtoken.models import Token
import json

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.access_code = self.scope['url_route']['kwargs']['access_code']
        self.game_name = 'game_%s' % self.access_code

        await self.channel_layer.group_add(
            self.game_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
       

        await self.channel_layer.group_discard(
            self.game_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        cmd = data['type']

        if cmd == 'JOIN_GAME':
            host = data['host']
            score = data['score']
            guest = data['guest']

            await self.channel_layer.group_send(
            self.game_name,
                {
                    'type': 'join_game',
                    'host': host,
                    'score': score,
                    'guest': guest,
                }
            )
        
        if cmd == 'MAKE_MOVE':
            board = data['board']
            whoMadeMove = data['whoMadeMove']
            nextMove = 'O' if whoMadeMove == 'X' else 'X'
            await self.channel_layer.group_send(
            self.game_name,
                {
                    'type': 'make_move',
                    'board': board,
                    'nextMove': nextMove
                }
            )
        
        if cmd == 'ANNOUNCE_WINNER':
            message = data['message']
            score = data['score']
            creator = data['creator']
            opponent = data['opponent']

            await self.channel_layer.group_send(
            self.game_name,
                {
                    'type': 'announce_winner',
                    'message': message,
                    'score': score,
                    'creator': creator,
                    'opponent': opponent,
                }
            )

        if cmd == 'VOTE':
            vote = data['vote']

            await self.channel_layer.group_send(
            self.game_name,
                {
                    'type': 'vote',
                    'vote': vote,
                }
            )

        if cmd == 'START_NEW_GAME':
            access_code = data['access_code']

            await self.channel_layer.group_send(
            self.game_name,
                {
                    'type': 'start_new_game',
                    'access_code': access_code,
                }
            )

    async def start_new_game(self, event):
        type = event['type']
        access_code = event['access_code']

        await self.send(text_data=json.dumps({
            'type': type,
            'access_code': access_code
        }))

    async def vote(self, event):
        type = event['type']
        vote = event['vote']

        await self.send(text_data=json.dumps({
            'type': type,
            'vote': vote
        }))


    async def make_move(self, event):
        type = event['type']
        board = event['board']
        nextMove = event['nextMove']

        await self.send(text_data=json.dumps({
            'board': board,
            'nextMove': nextMove,
            'type': type
        }))

    async def join_game(self, event):
        type = event['type']
        host = event['host']
        score = event['score']
        guest = event['guest']

        await self.send(text_data=json.dumps({
            'type': type,
            'host': host,
            'score': score,
            'guest': guest,
        }))

    async def announce_winner(self, event):
        type = event['type']
        message = event['message']
        score = event['score']
        creator = event['creator']
        opponent = event['opponent']

        await self.send(text_data=json.dumps({
            'type': type,
            'message': message,
            'score': score,
            'creator': creator,
            'opponent': opponent,
        }))

    