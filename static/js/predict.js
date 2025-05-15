document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([20, 0], 2);
    let lastPredictionDiv = document.getElementById('lastPrediction');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    document.getElementById('predictBtn').addEventListener('click', function () {
        const lat = parseFloat(document.getElementById('latitude').value);
        const lng = parseFloat(document.getElementById('longitude').value);

        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude.');
            return;
        }

        runPrediction(lat, lng);
    });

    document.getElementById('locationBtn').addEventListener('click', function () {
        const state = document.getElementById('state').value;
        const district = document.getElementById('district').value;
        const city = document.getElementById('city').value;

        if (!state || !district || !city) {
            alert('Please fill in state, district, and city.');
            return;
        }

        const query = `${city}, ${district}, ${state}`;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
                    runPrediction(lat, lng);
                } else {
                    alert('Location not found.');
                }
            })
            .catch(() => alert('Error fetching coordinates.'));
    });

    function runPrediction(lat, lng) {
        map.setView([lat, lng], 10);
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`Prediction Point: (${lat.toFixed(4)}, ${lng.toFixed(4)})`)
            .openPopup();

        fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon: lng })
        })
            .then(response => {
                if (!response.ok) throw new Error(`Server error ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const res = data.data;
                    lastPredictionDiv.innerHTML = `
                        <div class="card p-3 mt-3">
                            <h5>Latest Prediction</h5>
                            <p><strong>Location:</strong> ${res.location}</p>
                            <p><strong>Temperature:</strong> ${res.temperature} °C</p>
                            <p><strong>Groundwater Level:</strong> ${res.groundwater_level} m</p>
                            <a href="/result" class="btn btn-primary mt-2">View Full Results</a>
                        </div>
                    `;
                } else {
                    alert(`Prediction failed: ${data.error}`);
                }
            })
            .catch(err => alert(`Error sending prediction request: ${err.message}`));
    }
});
