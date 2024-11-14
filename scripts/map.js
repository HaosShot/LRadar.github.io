// Координаты цели
const targetCoords = {
    latitude: 54.007822,
    longitude: 38.306330
};

let userCoords = null; // Координаты пользователя
let heading = 0;    // Текущий угол ориентации относительно севера

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

        // Угол, на который нужно повернуть стрелку относительно северного направления
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
    if (event.webkitCompassHeading !== undefined) {
        // Используем `webkitCompassHeading`, если доступен (iOS)
        heading = event.webkitCompassHeading;
    } else {
        // На Android используем комбинацию `alpha`, `beta`, `gamma` для вычисления направления на север
        const alpha = event.alpha ? event.alpha : 0;
        const beta = event.beta ? event.beta : 0;
        const gamma = event.gamma ? event.gamma : 0;

        // Рассчитываем направление с учетом углов устройства
        const alphaRad = alpha * (Math.PI / 180);
        const betaRad = beta * (Math.PI / 180);
        const gammaRad = gamma * (Math.PI / 180);

        // Корректируем угол поворота с учетом всех углов
        const compassHeading = Math.atan2(
            Math.sin(alphaRad) * Math.cos(betaRad),
            Math.cos(alphaRad) * Math.cos(gammaRad) + Math.sin(gammaRad) * Math.sin(betaRad) * Math.sin(alphaRad)
        );

        // Переводим в градусы и приводим к значению 0–360
        heading = (compassHeading * (180 / Math.PI) + 360) % 360;
    }
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
