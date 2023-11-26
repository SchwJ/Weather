const API_KEY = '88d0cf4160af7b4af3665e74437c66b9';
const widgets = document.getElementById("widgets");
document.getElementById("showButton").addEventListener("click", showWeather);

let map;
ymaps.ready(function () {
    map = new ymaps.Map(`map`, {
        center: [56, 60],
        zoom: 10,
    });
});

function showWeather() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    if (!(typeof parseFloat(lat) === 'number' && isFinite(parseFloat(lat)) &&
        typeof parseFloat(lon) === 'number' && isFinite(parseFloat(lon)) &&
        typeof parseFloat(lat - 0) === 'number' && isFinite(parseFloat(lat - 0)) &&
        typeof parseFloat(lon - 0) === 'number' && isFinite(parseFloat(lon - 0)) &&
        Math.abs(parseFloat(lat)) <= 90 && Math.abs(parseFloat(lon)) <= 180)) {
        document.getElementById('errorMessage').innerText = 'Введите верные координаты';
        return;
    }
    document.getElementById('errorMessage').innerText = '';
    getWeather(lat, lon);
}

let widgetsMapButtonList = [];
let counter = 0
function getWeather(lat, lon) {
    const id = counter++;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=ru`)
        .then(response => response.json())
        .then((data) => {
            widgets.insertAdjacentHTML("beforeend", createWidget(data, id));
            ymaps.ready(
                new ymaps.Map(`map-${id}`, {
                    center: [lat, lon],
                    zoom: 10,
                }));
            widgetsMapButtonList.push({id: id, lat: lat, lon: lon});
            widgetsMapButtonList.map((widgetMapButton) => {
                document.getElementById(widgetMapButton.id)?.addEventListener('click', () => {
                    map.setCenter([widgetMapButton.lat, widgetMapButton.lon], 10);
                }, false);
            })
        });
}

function createWidget(data, widgetId) {
    return `<div class="widget">
        <div class="widgetWeatherInfo">
            <div class="widgetWeatherInfoParameters">
                <div id="temperature">
                    Температура: ${(data.main.temp + -273).toFixed(0)}°C
                </div>
                <div id="wind">
                    Скорость ветра: ${(data.wind.speed).toFixed(0)} м/c
                </div>
                <div id="humidity">
                    Влажность: ${data.main.humidity}%
                </div>
                <div class="widgetWeatherDesc">
                    Облачность: ${data.weather[0].description}
                </div>
                <img alt="Облачность" class="widgetWeatherIcon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </div>
            <button class="widgetCloseButton" onclick="this.parentNode.remove()">
                X
            </button>
        </div>
        <div class="map" id="map-${widgetId}"></div>
        
    </div>`
}

