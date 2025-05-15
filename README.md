# Gwl-prediction

🌍 Groundwater Level Predictor
This is a simple Flask web application that predicts groundwater levels based on the latitude and longitude using live weather data from the WeatherAPI.

🧰 Features
☁️ Uses WeatherAPI to fetch current temperature by coordinates

📍 Predicts groundwater level using a basic logic model

🕓 Maintains a session-based history of last 5 predictions

🌐 Clean and simple UI with routes for:

Home
Prediction form
Prediction result
History of predictions
🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/groundwater-level-predictor.git
cd groundwater-level-predictor
2. Set up the environment
It's recommended to use a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
3. Install dependencies
pip install Flask requests
4. Set your API key
Replace the default API key in GWL_Predictor.py or set the WEATHER_API_KEY environment variable:

export WEATHER_API_KEY=your_api_key  # on Linux/macOS
set WEATHER_API_KEY=your_api_key     # on Windows
5. Run the app
python app.py
Open http://127.0.0.1:5000 in your browser.

📂 Project Structure
.
├── app.py                  # Main Flask application
├── GWL_Predictor.py        # Prediction logic using WeatherAPI
├── templates/
│   ├── home.html
│   ├── predict.html
│   └── result.html
└── static/                 # Optional: for CSS, JS, images
🧪 Example API Usage
POST /predict Request:

{
  "lat": 19.07,
  "lon": 72.87
}
Response:

{
  "success": true,
  "data": {
    "temperature": 31.0,
    "groundwater_level": 122.3,
    "location": "Mumbai"
  }
}
📜 License
This project is licensed under the MIT License. See LICENSE for details.
