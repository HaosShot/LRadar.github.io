document.addEventListener('DOMContentLoaded', function () {
    if (typeof L === 'undefined') {
        console.error("Leaflet не загружен. Проверьте подключение библиотеки.");
        return;
    }

    const map = L.map('map').setView([54.009963, 38.306521], 19); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const targetCoords = [54.009963, 38.306521]; 



    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
        } else {
            alert("Геолокация не поддерживается вашим браузером.");
        }
    }

    function onGeoSuccess(position) {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        const status = document.getElementById('status');
        status.textContent = "Маршрут загружен!";

        map.setView(userCoords, 13);

        L.marker(userCoords).addTo(map)
            .bindPopup("Вы здесь")
            .openPopup();

        const routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userCoords[0], userCoords[1]),
                L.latLng(targetCoords[0], targetCoords[1])
            ],
            routeWhileDragging: true,
        }).addTo(map);

        updateArrowPosition(userCoords);
    }

    function onGeoError(error) {
        console.warn("Ошибка получения геолокации: ", error);
        document.getElementById('status').textContent = "Не удалось получить вашу геолокацию.";
    }

    document.getElementById('allow-geo').addEventListener('click', function () {
        document.getElementById('geo-modal').style.display = 'none';
        getUserLocation();
    });

    document.getElementById('deny-geo').addEventListener('click', function () {
        document.getElementById('geo-modal').style.display = 'none';
        document.getElementById('status').textContent = "Вы отказались от предоставления доступа к геолокации.";
    });

    document.getElementById('geo-modal').style.display = 'block';
});

function createHearts() {
    const heartsContainer = document.getElementById("hearts-container");
    const authContainer = document.querySelector(".container");
    const titleCont = document.querySelector(".geo-modal");
  
    if (!heartsContainer || !authContainer || !titleCont) return;

    heartsContainer.innerHTML = "";

    const authRect = authContainer.getBoundingClientRect();
    const titleRect = titleCont.getBoundingClientRect();

    const step = window.innerWidth <= 544 ? 115 : 100; 
    const heartSize = 10; 

    const rows = Math.ceil(window.innerHeight / step); 
    const cols = Math.ceil(window.innerWidth / step); 

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const posX = col * step + (row % 2 === 0 ? 0 : step / 2); 
            const posY = row * step;

            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = "❤️";

            heart.style.left = `${posX}px`;
            heart.style.top = `${posY}px`;
            heart.style.animationDelay = `${Math.random() * 2}s`; 

            heartsContainer.appendChild(heart);
        }
    }
}

window.onload = createHearts;
window.onresize = createHearts;
