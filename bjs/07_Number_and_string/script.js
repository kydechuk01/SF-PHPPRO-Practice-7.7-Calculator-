// git: https://kydechuk01.github.io/SF-PHPPRO-Practice-7.7-Calculator-/bjs/07_Number_and_string/index.html

` посмотреть
 https://codequest.ru/articles/kalkulyator-na-chistom-javascript
 https://bootsnipp.com/snippets/ZlyvE
 https://mdbootstrap.com/docs/standard/extended/calculator/

Цель: Разработать калькулятор без использования eval.

Поставленные задачи:
 - позволить интуитивно просто вводить как положительные, так и отрицательные операнды
 - вычисление дробных числех в обоих знаках
 - ввод точки на пустом операнде дополняет ведущим "0"
 - акцент на предотвращении ошибочного ввода (повтор знаков или запятых)
 - позволить выполнять вычисления типа: -0.05-(0.05), или 5*(-1.005) [скобки только для примера]

 пока не решено:
 - отказаться от бутстрапа в пользу собственных стилей
 - проблема с точностью вычислений в js ( типа 0.2 * 0.1 = 0.30000000000000004)

`
// Инициализация переменных и констант

// задаем начальные значения первого операнда
let firstOperand = '0';
let secondOperand = '';
let operation = '';
let result = '';
let success = false; // признак успешно завершенной калькуляции
let comma1 = false; // признак наличия дробной части в операнде-1
let comma2 = false; // признак наличия дробной части в операнде-2
let wasError = false; // флаг ошибки

// этапы ввода данных
let step0 = true; // ожидаем минус как знака отрицательного операнда-1
let step1 = false; // идет ввод тела операнда-1
let step2 = false; // у нас есть операция
let step3 = false; // ожидаем минус как знак отрицательного операнда-2
let step4 = false; // идет ввод тела операнда-2

const operationsList = ['+', '-', '/', '*', '=', 'AC', 'CE', '+-', '⌫'];
const allowedDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
// const allowedChars = /^[0-9\-\.]+$/;

const inputWindow = document.querySelector('#calc #inputWindow');
const calcButtons = document.querySelectorAll('#calc .btn');

// логирование этапов ввода данных в консоль
function consoleSteps() {
  console.log(`s0:${step0}, s1:${step1}, s2:${step2}, s3:${step3}, s4:${step4}, comma1:${comma1}, comma2:${comma2}`)
};


function resetSteps() {
  step0 = false;
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;
}

// сбрасываем калькулятор
function resetCalc() {
  firstOperand = '0'; // задаем начальное значение первого операнда
  secondOperand = '';
  operation = '';
  result = '';
  step0 = true;
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;
  comma1 = false; // признак наличия дробной части первого операнда
  comma2 = false; // признак наличия дробной части первого операнда
  success = false; // признак успешно завершенной калькуляции
  wasError = false; // сбрасываем флаг ошибки
  renderCalcContent();
};

// обновить окно калькулятора
function renderCalcContent() {
  inputWindow.value = firstOperand + operation + secondOperand;
}

// Вычисление результата
function calculate() {
  // consoleSteps();
  console.log(`firstOperand=${firstOperand}, sign:${operation}, secondOperand=${secondOperand}`);
  // проверим через регэксп, есть ли в операндах хотя бы одна цифра
  if (/\d/.test(firstOperand) && /\d/.test(secondOperand) && operation) {
    switch (operation) {
      case '+': // Сложение 
        result = Number(firstOperand) + Number(secondOperand);
        firstOperand = result;
        secondOperand = '';
        comma2 = false;
        operation = '';
        success = true;
        step4 = false;
        renderCalcContent();
        break;
      case '-': // Вычитание 
        result = Number(firstOperand) - Number(secondOperand);
        firstOperand = result;
        secondOperand = '';
        comma2 = false;
        operation = '';
        success = true;
        step4 = false;
        renderCalcContent();
        break;

      case '*': // Умножение
        result = Number(firstOperand) * Number(secondOperand);
        firstOperand = result;
        secondOperand = '';
        comma2 = false;
        operation = '';
        success = true;
        step4 = false;
        renderCalcContent();
        break;

      case '/': // Деление 
        if (Number(secondOperand) !== 0) {
	  // проверяем деление на 0
          result = Number(firstOperand) / Number(secondOperand);
         } else {
	     result = 'Ошибка: Деление на ноль!' 
	     wasError = true; // установим флаг ошибки
	    };
        firstOperand = result;
	// после деления надо очистить
	// второй операнд, операцию, запятую и этап
        secondOperand = '';
        comma2 = false;
        step4 = false; // отменяем ввод операнда-2
        operation = '';
        success = true;
        
        renderCalcContent();
        break;
    }

  }
};

// функция посимвольного заполнения операндов и знака операции
function processInput(newSymbol) {

  console.log('Input', newSymbol);

  // обрабатываем ввод только для разрешенных символов
  if (allowedDigits.includes(newSymbol)
    || operationsList.includes(newSymbol)) {

    switch (newSymbol) {

      case '+-': // инвертируем результат операции или первый операнд
        consoleSteps();
        if (success || step0 || step1) {
          if (/\d/.test(firstOperand)) { firstOperand = -firstOperand; resetSteps; step1 = true }
          else if (firstOperand == '-') { firstOperand = ''; resetSteps; step0 = true }
          else if (firstOperand == '' || firstOperand === '0') { firstOperand = '-'; resetSteps; step1 = true };
          success = false;
        };
        renderCalcContent;
        break;

      case "AC":
        // сбрасываем состояние калькулятора
        resetCalc();
        break;

      case "CE":
        if (wasError) { break }; // блокируем кнопку, пока не сброшена ошибка
        // очищаем операнд-2 или операцию, но не трогаем операнд-1
        if (step4) { secondOperand = ''; comma2 = false; step3 = true; step4 = false }
        else if (step2 || step3) { operation = ''; step1 = true; step2 = false; step3 = false };
        renderCalcContent;
        break;

      case "⌫":
        // очищаем последний символ или операцию
        consoleSteps();
        if (wasError) { break }; // блокируем кнопку, пока не сброшена ошибка
        if (step4 && secondOperand) {
          secondOperand = secondOperand.toString();
          secondOperand = secondOperand.slice(0, -1);
          if (!secondOperand.includes('.')) { comma2 = false }
          if (secondOperand.length == 0) { step3 = true; step4 = false }
        }
        else if (step2 || step3) {
          operation = ''; resetSteps(); step1 = true;
        }
        else if (step0 || success || step1 && firstOperand) {
          firstOperand = firstOperand.toString();
          firstOperand = firstOperand.slice(0, -1);
          if (!firstOperand.includes('.')) { comma1 = false };
          if (firstOperand.length == 0) { resetSteps; step0 = true }
        }
        renderCalcContent;
        break;

      case ".":
        if (wasError) { break }; // блокируем кнопку, пока не сброшена ошибка
        // сбросим калькулятор, если точка введена после =
        if (success) { resetCalc() };

        // точка в начале строки добавит ведущий "0" к первому операнду
        if (step0) { firstOperand = '0.'; comma1 = true; resetSteps(); step1 = true; }

        // если идет ввод операнда-1 и еще не было точки, то добавим точку
        else if (step1 && !comma1) {
          // на этапе-1 операнд "-" превращаем в "-0."
          if (firstOperand == '-') { firstOperand = '-0.' }
          // иначе просто добавляем точку
          else { firstOperand += '.' }
          comma1 = true; // только 1 точка в операнде-1
        }
        // после ввода операции если пользователь сразу нажал точку, то добавим ведущий "0"
        else if (step3) { secondOperand = '0.'; comma2 = true; resetSteps(); step4 = true }
        else if (step4 && !comma2) {
          // на этапе-4 операнд "-" превращаем в "-0."
          if (secondOperand === '-') { secondOperand = '-0.' }
          // в любом другом случае просто добавим точку
          else { secondOperand += '.' };
          comma2 = true; // только 1 точка в операнде-2
        };
        consoleSteps;
        renderCalcContent;
        break;

      case "-":
        if (wasError) { break }; // блокируем кнопку, пока не сброшена ошибка

        // логика блока позволяет ввести выражение типа: -NUM1--NUM2= с корректным
        // разнесением знака "-" в каждую составляющую математического выражения

        // если мы в операнде 1 уже имеем результат предыдущего вычисления (success == true),
        // то "-" это уже ввод новой операции, тогда переопределяем этапы и сбрасываем success:
        if (success) {
          operation = '-';
          resetSteps(); step2 = true; step3 = true;
          success = false;
        }
        // иначе базовый сценарий: в начале строки ожидаем минус как начало отрицательного
        // операнда-1 (step0) и далее переходим ко вводу тела операнда-1(step1)
        else if (step0) { firstOperand = '-'; resetSteps(); step1 = true }

        // если мы вводили первый операнд и в нем есть хоть одна цифра,
        // то "-" устанавливает знак операции, а мы переходим ко ожиданию ввода
        // знака минус для второго операнда (step3)
        else if (step1 && /\d/.test(firstOperand)) { operation = '-'; step1 = false; step2 = true; step3 = true }

        // на этапе step3 "-" означает ввод отрицательного знака для операнда-2
        // после переходим к step4 для ввода цифр тела операнда-2
        else if (step3) { secondOperand = '-'; resetSteps(); step4 = true }

        renderCalcContent(); // отрисовываем калькулятор
        break;

      case "+":
        if (wasError) { break }; // блокируем кнопку, пока не сброшена ошибка
        if (success) {
          // операнд-1 уже есть
          operation = '+';
          resetSteps(); step2 = true; step3 = true;
          success = false;
        }
        else if (step1 && /\d/.test(firstOperand)) { // в первом операнде есть хотя бы одна цифра
          operation = '+';
          resetSteps(); step2 = true; step3 = true;
        };

        renderCalcContent(); // отрисовываем калькулятор
        break;

      case "/":
        // операнд-1 уже есть, и он содержит хотя бы одну цифру?
        if ((success || step1) && (/\d/.test(firstOperand))) {
          operation = '/';
          resetSteps(); step2 = true; step3 = true;
          success = false;
          renderCalcContent(); // отрисовываем калькулятор
        }
        break;

      case "*":
        // операнд-1 уже есть, и он содержит хотя бы одну цифру?
        if ((success || step1) && (/\d/.test(firstOperand))) {
          operation = '*';
          resetSteps(); step2 = true; step3 = true;
          success = false;
          renderCalcContent(); // отрисовываем калькулятор
        }
        break;

      case "=":
        calculate();
        break;

      default:
        // ввод новой цифры после знака = сбрасывает кальулятор в 0
        if (success) { resetCalc() };
        // принимаем цифры на вход
        if (step0) { firstOperand = newSymbol; resetSteps(); step1 = true }
        else if (step1) { firstOperand += newSymbol }
        else if (step3) { secondOperand = newSymbol; resetSteps(); step4 = true }
        else if (step4) { secondOperand += newSymbol };
        renderCalcContent();
        break;
    }
  }
}

// НАЧАЛО КОДА

// блокируем вставку через буфер обмена в окно калькулятора
inputWindow.addEventListener('paste', function (event) {
  event.preventDefault();
})

// блокируем текстовый ввод в окно калькулятора
inputWindow.addEventListener('keydown', function (event) {
  event.preventDefault();
})

// сброс состояния калькулятора
resetCalc();

// Назначаем слушателей на кнопки калькулятора, объекты с классом .btn
calcButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    processInput(this.innerText);
    renderCalcContent();
  });
})

