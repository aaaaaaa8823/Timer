const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes'); 
const secondsElement = document.getElementById('seconds');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn'); 
const touch = 30;

let hours = 0;
let minutes = 0;
let seconds = 0;
let timerInterval;
let activeUnit = null; // Хранит текущий активный элемент (часы/минуты/секунды)
let startY = 0;
let isScrolling = false;
let touchStartTime = 0;

function formatTime(value) {
    return value.toString().padStart(2, '0'); //дополняет строку слева символом '0' до длины 2.
}

// Обновление отображения таймера
function updateTimer() {
    hoursElement.textContent = formatTime(hours);
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
}

// Обработчик прокрутки 
function handleWheel(e) {
    if (!activeUnit) return;
    
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    updateTimeValue(direction);
}

// Обработчик касания
function handleTouchStart(e) {
    //Определяем, был ли это тап (для выбора элемента) или начало свайпа
    touchStartTime = Date.now();
    startY = e.touches[0].clientY;
    
    // Если это быстрый тап - выбираем элемент
    if (Date.now() - touchStartTime < 200) {
        const touchX = e.touches[0].clientX;
        const timerRect = document.getElementById('timer').getBoundingClientRect();
        const unitWidth = timerRect.width / 3;
        
        // Определяем, по какому элементу был тап
        if (touchX < timerRect.left + unitWidth) {
            handleUnitClick('hours');
        } else if (touchX < timerRect.left + unitWidth * 2) {
            handleUnitClick('minutes');
        } else {
            handleUnitClick('seconds');
        }
    }
}

// Обработчик движения пальца
function handleTouchMove(e) {
    if (!activeUnit) return;
    
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    
    if (Math.abs(deltaY) > touch) {
        const direction = deltaY > 0 ? 1 : -1;
        updateTimeValue(direction);
        startY = currentY;
    }
}

// Обработчик окончания касания
function handleTouchEnd() {
    isScrolling = false;
}

// Обновление значения выбранного элемента времени
function updateTimeValue(delta) {
    if (activeUnit === 'hours') {
        hours = Math.max(0, Math.min(99, hours + delta));
    } else if (activeUnit === 'minutes') {
        minutes = Math.max(0, Math.min(59, minutes + delta));
    } else if (activeUnit === 'seconds') {
        seconds = Math.max(0, Math.min(59, seconds + delta));
    }
    
    updateTimer();
}

// Обработчик клика по элементам времени
function handleUnitClick(unit) {
    // Снимаем подсветку со всех элементов
    hoursElement.classList.remove('active');
    minutesElement.classList.remove('active');
    secondsElement.classList.remove('active');
    
    // Устанавливаем активный элемент и подсвечиваем его
    activeUnit = unit;
    document.getElementById(unit).classList.add('active');
}

// Обработчик кнопки старт/стоп
// Управление таймером
function toggleTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = "Start";
    } else {
        if (hours === 0 && minutes === 0 && seconds === 0) return;
        
        startBtn.textContent = 'Stop';
        timerInterval = setInterval(() => {
            if (seconds > 0) seconds--;
            else if (minutes > 0) { minutes--; seconds = 59; }
            else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
            else {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = "Start";
                alert('Time is up!');
                return;
            }
            updateTimer();
        }, 1000);
    }
}

// Инициализация
function init() {
    updateTimer();
    handleUnitClick('hours'); // Активируем часы по умолчанию
    
    // Назначаем обработчики
    hoursElement.addEventListener('click', () => handleUnitClick('hours'));
    minutesElement.addEventListener('click', () => handleUnitClick('minutes'));
    secondsElement.addEventListener('click', () => handleUnitClick('seconds'));
    
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    startBtn.addEventListener('click', toggleTimer);
}

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', init);