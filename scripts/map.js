// Координаты цели
const targetCoords = {
    latitude: 54.007822,
    longitude: 38.306330
};

let userCoords = null; // Текущие координаты пользователя

// DOM элементы
const arrowElement = document.getElementById('arrow');
const statusElement = document.getElementById('status');
const geoModal = document.getElementById('geo-modal');

// Функция для вычисления угла на координаты цели относительно текущего положения
function calculateAngleToTarget(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180;
    const dLon = (lon2 - lon1) * rad;
    const y = Math.sin(dLon) * Math.cos(lat2 * rad);
    const x = Math.cos(lat1 * rad) * Math.sin(lat2 * rad) - Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(dLon);
    return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

// Функция для обновления направления стрелки на точные координаты цели
function updateArrowDirection() {
    if (userCoords) {
        const angleToTarget = calculateAngleToTarget(
            userCoords.latitude,
            userCoords.longitude,
            targetCoords.latitude,
            targetCoords.longitude
        );

        // Поворот стрелки на угол, чтобы указывать на цель
        arrowElement.style.transform = `rotate(${angleToTarget}deg)`;
        statusElement.textContent = "Следуйте за стрелкой!";
    }
}

// Функция для отслеживания геолокации пользователя
function trackUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                userCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                updateArrowDirection();
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

// Обработчики для разрешения или запрета доступа к геолокации
document.getElementById('allow-geo').addEventListener('click', () => {
    geoModal.style.display = 'none';
    trackUserLocation();
});

document.getElementById('deny-geo').addEventListener('click', () => {
    geoModal.style.display = 'none';
    statusElement.textContent = "Геолокация отключена. Невозможно указать направление.";
});

// Показ модального окна для разрешения геолокации при загрузке страницы
window.addEventListener('load', () => {
    geoModal.style.display = 'flex';
});
