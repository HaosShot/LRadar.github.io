const targetLocation = { lat: 54.007822, lng: 38.306330 };
let currentHeading = 0;
let route = [];
let nextCheckpointIndex = 0;
let tracking = true; 

function getUserLocation() {
    if (navigator.geolocation) {
        showGeoModal();
    } else {
        document.getElementById("status").textContent = "Геолокация не поддерживается этим браузером.";
    }
}

function showGeoModal() {
    const geoModal = document.getElementById('geo-modal');
    if (!geoModal) return; 
    geoModal.style.display = 'flex';

    document.getElementById('allow-geo').addEventListener('click', function() {
        geoModal.style.display = 'none';
        calculateRouteOnce();
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else {
            document.getElementById('status').textContent = "Ориентация устройства не поддерживается.";
        }
    }, { once: true });

    document.getElementById('deny-geo').addEventListener('click', function() {
        geoModal.style.display = 'none';
        document.getElementById('status').textContent = 'Разреши :)';
    }, { once: true });
}

function calculateRouteOnce() {
    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        route = calculateRoute(userLat, userLng, targetLocation.lat, targetLocation.lng);
        updateArrowToCheckpoint(userLat, userLng);
    }, showError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
}

function updateArrowToCheckpoint(userLat, userLng) {
    if (nextCheckpointIndex >= route.length) {
        document.getElementById("status").textContent = "На месте";
        stopTracking();
    } else {
        const checkpoint = route[nextCheckpointIndex];
        const targetAngle = calculateAngle(userLat, userLng, checkpoint.lat, checkpoint.lng);
        const distanceToCheckpoint = calculateDistance(userLat, userLng, checkpoint.lat, checkpoint.lng);

        if (distanceToCheckpoint < 10) { 
            nextCheckpointIndex++;
        }

        updateArrow(targetAngle);
        document.getElementById("status").textContent = "Чапай";
    }
}

function handleOrientation(event) {
    if (!tracking) return; 
    if (event.absolute || event.alpha !== null) {
        currentHeading = event.alpha;
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            updateArrowToCheckpoint(userLat, userLng);
        });
    }
}

function updateArrow(targetAngle) {
    const arrow = document.getElementById("arrow");
    const adjustedAngle = (targetAngle - currentHeading + 360) % 360;
    arrow.style.transform = `translate(-50%, -50%) rotate(${adjustedAngle}deg)`;
}

function calculateRoute(lat1, lng1, lat2, lng2) {
    const route = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const lat = lat1 + (lat2 - lat1) * (i / steps);
        const lng = lng1 + (lng2 - lng1) * (i / steps);
        route.push({ lat, lng });
    }
    return route;
}

function calculateAngle(lat1, lng1, lat2, lng2) {
    const deltaLng = lng2 - lng1;
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    return Math.atan2(y, x) * (180 / Math.PI);
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function showError(error) {
    const status = document.getElementById("status");
    if (!status) return;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            status.textContent = "Пользователь отклонил запрос на доступ к геолокации.";
            break;
        case error.POSITION_UNAVAILABLE:
            status.textContent = "Информация о местоположении недоступна.";
            break;
        case error.TIMEOUT:
            status.textContent = "Время запроса геолокации истекло.";
            break;
        case error.UNKNOWN_ERROR:
            status.textContent = "Неизвестная ошибка.";
            break;
    }
}

function createHearts() {
    const heartsContainer = document.getElementById("hearts-container");
    const authContainer = document.querySelector(".geo-modal");
    const titleCont = document.querySelector(".container");
    if (!heartsContainer || !authContainer || !titleCont) return;

    heartsContainer.innerHTML = "";
    const step = window.innerWidth <= 544 ? 115 : 100; 
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

function stopTracking() {
    tracking = false;
    window.removeEventListener('deviceorientation', handleOrientation);
}

document.addEventListener('DOMContentLoaded', function() {
    getUserLocation();
});
