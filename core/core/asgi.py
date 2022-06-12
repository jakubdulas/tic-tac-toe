from email.mime import application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from game.routing import websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        'websocket': AuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns
            )
        )
    }
)