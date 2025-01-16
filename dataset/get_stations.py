import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SEOUL_OPENDATA_KEY = os.getenv('VITE_SEOUL_OPENDATA_KEY')

def fetch_data(start, end):
    url = f'http://openapi.seoul.go.kr:8088/{SEOUL_OPENDATA_KEY}/json/tbCycleStationInfo/{start}/{end}/'
    response = requests.get(url)
    response.raise_for_status()
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data for range {start}-{end}, Status Code: {response.status_code}")
    return response.json()

ranges = [(1, 1000), (1001, 2000), (2001, 3000), (3001, 3143)]
# ranges = [(1,10)]
all_features = []

for start, end in ranges:
    print(f"Fetching data for range {start}-{end}...")
    data = fetch_data(start, end)
    stations = data['stationInfo']['row']
    for station in stations:
        latitude = float(station['STA_LAT'])
        longitude = float(station['STA_LONG'])
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude],
            },
            "properties": {
                "name": station['RENT_NM'],
                "address": station['STA_ADD1'],
                "id": station['RENT_NO'],
                "district": station['STA_LOC']
            },
        }
        all_features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": all_features,
}

output_file = 'seoul_bike_stations.geojson'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False, indent=4)

print(f"GeoJSON file has been created successfully at {output_file}.")
