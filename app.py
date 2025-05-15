from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from GWL_Predictor import predict_groundwater

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')

        if lat is None or lon is None:
            return jsonify({'success': False, 'error': 'Latitude and longitude are required.'})

        result = predict_groundwater(lat, lon)

        if 'error' in result:
            return jsonify({'success': False, 'error': result['error']})

        # Initialize history list in session if missing
        if 'history' not in session:
            session['history'] = []

        # Append result
        session['history'].append({
            'lat': lat,
            'lon': lon,
            'location': result['location'],
            'temperature': result['temperature'],
            'groundwater_level': result['groundwater_level']
        })

        # Keep only last 5 entries
        session['history'] = session['history'][-5:]

        # Save last result
        session['last_result'] = result

        return jsonify({'success': True, 'data': result})

    return render_template('predict.html')

@app.route('/result')
def result():
    last_result = session.get('last_result')
    return render_template('result.html', result=last_result)

@app.route('/history')
def history():
    history_list = session.get('history', [])
    return jsonify({'history': history_list})

if __name__ == '__main__':
    app.run(debug=True)
