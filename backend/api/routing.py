from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/sim/", consumers.SimConsumer.as_asgi()),
]
