import requests
import os

API_KEY = os.getenv('WEATHER_API_KEY', 'f734ec4cc4d1440c835151610242910')  # fallback to hardcoded key

def predict_groundwater(lat, lon):
    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return {'error': 'Invalid latitude or longitude values.'}

    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={lat},{lon}"
    response = requests.get(url)

    if response.status_code != 200:
        return {'error': f'API request failed with status {response.status_code}.'}

    data = response.json()
    if 'error' in data:
        return {'error': data['error']['message']}

    temperature = data['current']['temp_c']
    location_name = data['location']['name']

    # Mock groundwater level (you can replace this with real model or data)
    groundwater_level = round(5 + (lat % 1 + lon % 1), 2)
    if temperature> 40:
        groundwater_level += 20
    elif temperature >30 and temperature <= 40:
        groundwater_level += 5
    return {
        'temperature': temperature,
        'groundwater_level': groundwater_level*10,
        'location': location_name
    }
