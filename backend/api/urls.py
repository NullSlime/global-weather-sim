from django.urls import path
from .views import *

urlpatterns = [
    path('api/world-weather/', world_weather),
    path("api/stations/", stations),
    path('', index),
]