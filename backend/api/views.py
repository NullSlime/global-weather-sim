from django.shortcuts import render

# weather/views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .services import fetch_open_meteo
from .services import fetch_noaa_stations

@api_view(['GET'])
def world_weather(request):
    points = [
        (35.6895, 139.6917),   # Tokyo
        (40.7128, -74.0060),   # New York
        (51.5074, -0.1278),    # London
        (-33.8688, 151.2093),  # Sydney
    ]

    results = [fetch_open_meteo(lat, lon) for lat, lon in points]

    return Response({"points": results})

@api_view(["GET"])
def stations(request):
    count = int(request.GET.get("count", 1500))
    data = fetch_noaa_stations(max_count=count)
    return Response({"stations": data})

def index(request):
    return render(request, 'index.html')
