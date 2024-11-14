const pass = "bengalsnovanasral";
let isAccess = false;

function checkAccess() {
    const userPass = document.querySelector('.secretCode').value;

    if (userPass === pass) {
        isAccess = true;
        document.getElementById('result').textContent = "Доступ разрешен!";
        
        setTimeout(() => {
            window.location.href = 'map.html';
        }, 2000); 
    } else {
        isAccess = false;
        document.getElementById('result').textContent = "Неверный код!";
    }
    return isAccess;
}

function createHearts() {
    const heartsContainer = document.getElementById("hearts-container");
    const authContainer = document.querySelector(".Auth");
    const titleCont = document.querySelector(".codeTitle");
    if (!heartsContainer || !authContainer || !titleCont) return;

    if (!heartsContainer) return;

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

document.getElementById('checkButton').addEventListener('click', checkAccess);

window.onload = createHearts;
window.onresize = createHearts;

