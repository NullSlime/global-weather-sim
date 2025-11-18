# weather/services.py
import requests


def fetch_open_meteo(lat: float, lon: float):
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&hourly=temperature_2m,pressure_msl,windspeed_10m"
    )

    r = requests.get(url)
    r.raise_for_status()

    data = r.json()

    # 最新時刻を返す
    return {
        "lat": lat,
        "lon": lon,
        "temp": data["hourly"]["temperature_2m"][0],
        "pressure": data["hourly"]["pressure_msl"][0],
        "wind": data["hourly"]["windspeed_10m"][0],
    }

NOAA_STATIONS_URL = "https://noaa-ghcn-pds.s3.amazonaws.com/ghcnd-stations.txt"

def fetch_noaa_stations(max_count=1500):
    r = requests.get(NOAA_STATIONS_URL)
    r.raise_for_status()

    stations = []
    for line in r.text.splitlines():
        # NOAA 固定幅形式
        station_id = line[0:11].strip()
        lat = float(line[12:20].strip())
        lon = float(line[21:30].strip())
        elevation = line[31:37].strip()
        name = line[41:71].strip()

        stations.append({
            "id": station_id,
            "lat": lat,
            "lon": lon,
            "elevation": elevation,
            "name": name,
        })

        if len(stations) >= max_count:
            break

    return stations
