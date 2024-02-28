// объявляем переменные и константы

const MIN_LIMIT = -999;
const MAX_LIMIT = 999;
let minValue; // нижняя граница
let maxValue; // верхняя граница
let answerNumber; // ответ
let guessCount; // счетчик попыток угадывания
let gameRun; // идет угадывание или мы закончили?

// текстовые строки
const wrongPlayPhrases = ['Вы загадали некорректное число!',
                          'Мда, сдаюсь... \u{1F92F}',
                          'По-моему, вы нечестно играете!'];

const winPhrases = [`Я всегда угадываю \u{1F60E}`,
                    'Спасибо за игру! 👌',
                    'Слава роботам! 🤖'];

const askPhrases = [`Возможно это число `,
                    'Вы загадали ',
                    'Сейчас я точно угадаю! Это ведь '];
                            
// поля работы с HTML
const guessCountField = document.querySelector('#guessCountField'); // поле счетчика
const minValueInput = document.querySelector('#minValueInput'); // поле для вывода нижней границы
const maxValueInput = document.querySelector('#maxValueInput'); // поле для вывода верхней границы
const rangeMinField = document.querySelector('#rangeMinField'); // поле для вывода нижней границы
const rangeMaxField = document.querySelector('#rangeMaxField'); // поле для вывода верхней границы
const answerField = document.querySelector('#answerField'); // поле ответа
const btnRetry = document.querySelector('#btnRetry'); // кнопка перезапуска
const btnMore = document.querySelector('#btnMore'); // кнопка больше
const btnLess = document.querySelector('#btnLess'); // кнопка больше
const btnEqual = document.querySelector('#btnEqual'); // кнопка больше
const btnStart = document.querySelector('#btnStart'); // кнопка больше
const settings = document.querySelector('#settings'); // блок настроек и старта игры
const gameField = document.querySelector('#gameField'); // игровая область

// сброс игры

function resetGame() {
    settings.style.display = 'block'; // отобразим поле настроек
    gameField.style.display = 'none'; // скроем игровое поле

    minValueInput.value = MIN_LIMIT;
    maxValueInput.value = MAX_LIMIT;

    guessCount = 0;
    answerNumber = undefined;
}

// Пытаемся угадать число посередине текущего диапазона
function guessNumber(min, max) {
    return Math.floor((min + max) / 2);
}

function answerNumToText (num) {
    // на входе число, на выходе либо то же самое число, либо
    // оно же записанное в виде текста, но только если длина записи
    // не превышает 20 символов

    // списки для текстовой записи чисел
    const txt_10to19 = ['десять','одиннацать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
    const txt_100s = ['','сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
    const txt_10s = ['','', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
    const txt_1s = ['','один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];

    num = Number(num); // приводим на всякий случай входное значение к числу

    let numText = ''; // обнуляем строку выдачи текстовой записи числа
    var rest = 0; // переменная остатка от предыдущего разряда
    var calc = 0; // переменная для внутренних подсчетов
    var numAbs = Math.abs(num); // копируем абсолютное значение числа

    console.log(`answerNumToText (${num})`);
 
    if (num === 0) {numText = '0'; return numText;} // вернем 0 без вариантов
    if (num < 0) {numText = 'минус'}; // добавим префикс для отрицательных чисел

    rest = numAbs;

    // вычисляем сколько сотен в числе
    calc = Math.floor(rest / 100);
    if (calc > 0) numText += ' ' + txt_100s[calc]; // добавим сотни текстом
    rest = rest - calc * 100; // вычтем целые сотни из числа

    if (rest >= 10 && rest <= 19) {
         // если после вычета сотен в остатке остались числа от 10 до 19,
         // задаем им уникальную строку и дальше единицы уже пропускаем
         numText += ' ' + txt_10to19[rest % 10];
    } else {
        // иначе подсчитываем десятки и единицы
        calc = Math.floor(rest / 10);
        if (calc >= 2) {
            numText += ' ' + txt_10s[calc]; // добавим десятки текстом
        };
        rest = rest - calc * 10; // убираем десятки из числа, в rest остаются единицы
        if (rest > 0) {
            numText += ' ' + txt_1s[Math.floor(rest)]
        };
    };

    console.log(numText, `(${numText.length} символов)`);

    // если длина строки текстового числа короче 20 символов, вернуть ее
    if (numText && numText.length<20) return numText;
    
    // иначе вернем само число, обернутое как текстовая строка
    return num;
};

// Поиск очередного числа
function newGuess() {
    if (!gameRun) return;
    
    // спрашиваем только, если игра продолжается
    guessCount++;
    answerNumber = guessNumber(minValue, maxValue);
    guessCountField.innerHTML = guessCount;

    // Выбираем один из трех вариантов вопросов
    const phraseRandom = Math.floor(Math.random() * 3); 
    answerField.innerHTML = askPhrases[phraseRandom] + '<span class="resultNum">' + answerNumToText(answerNumber) + '</span>?';
    
}

// begin
// обработчик кнопки Сброса игры
btnRetry.addEventListener('click', () => resetGame());

// обработчик кнопки Начать игру
btnStart.addEventListener('click', function () {

    settings.style.display = 'none'; // скроем поле настроек
    gameField.style.display = 'block'; // отобразим игровое поле

    // забрать со страницы границы угадывания
    minValue = Number(minValueInput.value);
    maxValue = Number(maxValueInput.value);

    // если ввод не число, установить лимиты по умолчанию
    if (isNaN(minValue)) { minValue = MIN_LIMIT };
    if (isNaN(maxValue)) { maxValue = MAX_LIMIT };

    // если числа выходят за пределы лимитов, или макс.граница ниже мин.границы,
    // то установить лимиты по умолчанию для каждого из чисел
    minValue = (minValue < MIN_LIMIT || minValue > MAX_LIMIT - 1) ? MIN_LIMIT : minValue;
    maxValue = (maxValue <= minValue || maxValue < MIN_LIMIT || maxValue > MAX_LIMIT) ? MAX_LIMIT : maxValue;

    // отобразить в игровом поле текущий диапазон
    rangeMinField.innerHTML = minValue;
    rangeMaxField.innerHTML = maxValue;

    answerField.innerText = ''; // очистка ответа
    guessCountField.innerHTML = guessCount; // сброс поля счетчика попыток
    gameRun = true; // игра начата

    // первая попытка угадывания
    newGuess();
});


// обработчик кнопки МЕНЬШЕ
btnLess.addEventListener('click', function () {
    if (!gameRun) return;

    // продолжаем только если идет игра
    if (maxValue-1 <= minValue) {
        wrongPlayMessage();
        gameRun = false;
    } else {
        maxValue = answerNumber - 1; // задаем новую верхнюю границу
        answerNumber = guessNumber(minValue, maxValue);
        newGuess();
    }

});

// обработчик кнопки БОЛЬШЕ
btnMore.addEventListener('click', function () {
    if (!gameRun) return;

    // продолжаем только если идет игра
    if (minValue >= maxValue) {
        wrongPlayMessage();
        gameRun = false;
    } else {
        minValue = answerNumber + 1;
        newGuess();
    }
})

// обработчик кнопки ВЕРНО
btnEqual.addEventListener('click', function () {
    if (!gameRun) return;

    // продолжаем только если идет игра
    guessCountField.innerHTML = guessCount + `. <span class="foundAnswer">Найден ответ, число ${answerNumber}!</span>`;
    
    // Выбираем один из трех вариантов победных ответов
    const phraseRandom = Math.floor(Math.random() * 3); 
    answerField.innerText = winPhrases[phraseRandom];

    gameRun = false;
})

// Игрок жульничает, выбираем 1 из 3 ответов об ошибке
function wrongPlayMessage () {
    const phraseRandom = Math.floor(Math.random() * 3); 
    answerField.innerText = wrongPlayPhrases[phraseRandom];
}

resetGame();
