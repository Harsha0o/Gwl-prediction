let chartCtx = document.getElementById('groundwaterChart').getContext('2d');

let groundwaterChart = new Chart(chartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Groundwater Level (m)',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Groundwater Level (m)' }
            },
            x: {
                title: { display: true, text: 'Location' }
            }
        }
    }
});

async function loadHistory() {
    try {
        const res = await fetch('/history');
        const json = await res.json();
        const history = json.history || [];

        const tbody = document.querySelector('#historyTable tbody');
        tbody.innerHTML = '';

        let labels = [];
        let dataPoints = [];

        // Only take the last 10 entries (if somehow more come through)
        const recentHistory = history.slice(-5);

        recentHistory.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.lat ? parseFloat(item.lat).toFixed(4) : '-'}</td>
                    <td>${item.lon ? parseFloat(item.lon).toFixed(4) : '-'}</td>
                    <td>${item.location || '-'}</td>
                    <td>${item.temperature !== undefined ? item.temperature + '°C' : '-'}</td>
                    <td>${item.groundwater_level !== undefined ? item.groundwater_level + ' m' : '-'}</td>
                </tr>
            `;
            tbody.innerHTML += row;

            labels.push(item.location || `Point ${index + 1}`);
            dataPoints.push(item.groundwater_level || 0);
        });

        groundwaterChart.data.labels = labels;
        groundwaterChart.data.datasets[0].data = dataPoints;
        groundwaterChart.update();
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

window.onload = loadHistory;
