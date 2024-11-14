// Координаты цели
const targetCoords = {
    latitude: 54.007822,
    longitude: 38.306330
};

let userCoords = null; // Координаты пользователя
let heading = null;    // Текущий угол ориентации устройства

// DOM элементы
const arrowElement = document.getElementById('arrow');
const statusElement = document.getElementById('status');
const geoModal = document.getElementById('geo-modal');

// Функция для вычисления угла направления на цель
function calculateBearing(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180;
    const dLon = (lon2 - lon1) * rad;
    const y = Math.sin(dLon) * Math.cos(lat2 * rad);
    const x = Math.cos(lat1 * rad) * Math.sin(lat2 * rad) - Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(dLon);
    return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

// Функция для обновления направления стрелки
function updateArrow() {
    if (userCoords && heading !== null) {
        const bearingToTarget = calculateBearing(
            userCoords.latitude,
            userCoords.longitude,
            targetCoords.latitude,
            targetCoords.longitude
        );

        // Угол, на который нужно повернуть стрелку
        const angle = bearingToTarget - heading;

        // Поворот стрелки на нужный угол
        arrowElement.style.transform = `rotate(${angle}deg)`;
        statusElement.textContent = "Следуйте за стрелочкой!";
    }
}

// Получение геолокации пользователя
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                userCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                updateArrow();
            },
            (error) => {
                statusElement.textContent = "Не удалось получить местоположение";
                console.error(error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        statusElement.textContent = "Ваше устройство не поддерживает геолокацию";
    }
}

// Получение ориентации устройства
function getDeviceOrientation(event) {
    heading = event.alpha; // Обновляем текущий угол ориентации устройства
    updateArrow();
}

// Запрашиваем разрешение на доступ к геолокации
document.getElementById('allow-geo').addEventListener('click', () => {
    geoModal.style.display = 'none';
    getLocation();
});

document.getElementById('deny-geo').addEventListener('click', () => {
    geoModal.style.display = 'none';
    statusElement.textContent = "Геолокация отключена. Невозможно указать направление.";
});
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

// Проверяем, поддерживается ли событие `DeviceOrientationEvent`
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', getDeviceOrientation);
} else {
    statusElement.textContent = "Ваше устройство не поддерживает ориентацию.";
}

// Показ модального окна для разрешения геолокации при загрузке страницы
window.addEventListener('load', () => {
    geoModal.style.display = 'flex';
});
