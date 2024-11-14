document.addEventListener('DOMContentLoaded', function () {
    const geoModal = document.getElementById('geo-modal');
    const allowGeoButton = document.getElementById('allow-geo');
    const denyGeoButton = document.getElementById('deny-geo');
    const arrow = document.getElementById('arrow');
    const status = document.getElementById('status');
    
    const targetCoords = [54.009963, 38.306521]; // Пример координат цели (Москва)

    let userLat, userLon;

    // Функция для получения данных о текущем местоположении пользователя
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;

                status.textContent = "Геолокация получена.";
                geoModal.style.display = "none"; // Скрыть модальное окно

                // Обновить направление стрелки
                updateArrowDirection();
            }, function() {
                status.textContent = "Ошибка получения геолокации.";
                geoModal.style.display = "block"; // Показать модальное окно
            });
        } else {
            alert("Геолокация не поддерживается вашим браузером.");
        }
    }

    // Функция для расчета направления стрелки
    function getArrowDirection(start, end) {
        const dx = end[1] - start[1]; // Разница в долготе
        const dy = end[0] - start[0]; // Разница в широте
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return angle;
    }

    // Обновление угла стрелки
    function updateArrowDirection() {
        if (userLat && userLon) {
            const direction = getArrowDirection([userLat, userLon], targetCoords);
            arrow.style.transform = `rotate(${direction}deg)`; // Поворачиваем стрелку в нужное направление
        }
    }

    // Обработчики событий для модального окна
    allowGeoButton.addEventListener('click', function () {
        getUserLocation();
    });

    denyGeoButton.addEventListener('click', function () {
        geoModal.style.display = "none";
        status.textContent = "Геолокация не была предоставлена.";
    });

    // Инициализация
    getUserLocation(); // Получаем геолокацию сразу после загрузки
});
