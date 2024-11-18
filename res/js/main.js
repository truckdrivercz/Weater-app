const API_KEY = 'API_KEY'; // https://openweathermap.org/
const search = document.getElementById("search");
let map;
let marker;

document.getElementById("cityInput").addEventListener("keydown", function(event){
    if (event.key === "Enter") {
        search.style.backgroundColor = "red";
        search.style.color = "yellow";
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert("Prosím zadejte název města");
        return;
    }

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=cz`);
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=cz`);
        const forecastData = await forecastResponse.json();

        displayWeather(weatherData, forecastData);
        displayMap(weatherData.coord.lat, weatherData.coord.lon);

        // Zde obnovíme původní barvy tlačítka po úspěšném načtení dat
        search.style.backgroundColor = "";
        search.style.color = "";
    } catch (error) {
        console.error("Nepodařilo se načíst data o počasí.", error);
        // V případě chyby také vrátíme barvy tlačítka
        search.style.backgroundColor = "";
        search.style.color = "";
    }
}

const displayWeather = (current, forecast) => {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <h2>Aktuální Počasí v ${current.name}</h2>
        <p>Teplota: ${current.main.temp} °C</p>
        <p>Počasí: ${current.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="Weather icon">
        <h2>5denní Předpověď</h2>
        ${forecast.list.slice(0, 5).map(item => `
            <p>${item.dt_txt}: ${item.main.temp} °C, ${item.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
        `).join('')}
    `;
}

const displayMap = (lat, lon) => {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup('Aktuální Poloha')
        .openPopup();
}