// посмотреть
// https://bootsnipp.com/snippets/ZlyvE
// https://mdbootstrap.com/docs/standard/extended/calculator/

// пока не решено:
// - проблема с точностью некоторых вычислений в js ( типа 0.2 * 0.1 = )
// - множественный ввод точки


let firstOperand = '';
let secondOperand = '';
let operation = '';
let result = '';
let success = false; // признак успешно завершенной калькуляции
let comma1 = false; // признак наличия дробной части первого операнда
let comma2 = false; // признак наличия дробной части первого операнда
let negSecondOperand = false;

const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Shift', 'End', 'Home'];
const allowedChars = /^[0-9\.]+$/;

const inputWindow = document.getElementById('inputWindow');
inputWindow.value = '0';

function calculate () {
  if (firstOperand && secondOperand && operation) {
    switch (operation) {
      case '+': // складываем +
        result = Number(firstOperand) + Number(secondOperand);
        inputWindow.value = result;
        firstOperand = result;
        secondOperand = '';
        operation = '';
        success = true;
        break;
      case '-': // вычитаем -
        result = Number(firstOperand) - Number(secondOperand);
        inputWindow.value = result;
        firstOperand = result;
        secondOperand = '';
        operation = '';
        success = true;
        break;
        
      case '*': // умножаем *
        result = Number(firstOperand) * Number(secondOperand);
        inputWindow.value = result;
        firstOperand = result;
        secondOperand = '';
        operation = '';
        success = true;
        break;
      
      case '/': // делим /
        result = Number(firstOperand) / Number(secondOperand);
        inputWindow.value = result;
        firstOperand = result;
        secondOperand = '';
        operation = '';
        success = true;
        break;

      case 'Neg': // инвертируем
        break;
    }

  }
};

// функция очистки поля ввода, если пользователь начал вводить новые цифры или нажимать кнопки после того, как нажал = 
function checkSuccess () {
  if (success || inputWindow.value == '0') {
      firstOperand = ''; // очищаем операнды и операцию
      secondOperand = '';
      operation = '';
      result = ''; // обнуляем результат
      inputWindow.value = ''; // очищаем поле ввода
      comma1 = false; // признак наличия дробной части первого операнда
      comma2 = false; // признак наличия дробной части первого операнда
      success = false; // начинаем ввод с чистого листа    
      negSecondOperand = false;  
    }
}

// блокируем вставку через буфер обмена любых запрещенных символов 
// разрешается вставить только числовое значение
inputWindow.addEventListener('paste', function(event) {
    checkSuccess(); // очистить экран ввода, если вставка делается после =
    var pastedData = event.clipboardData.getData('text/plain');
    // Регулярное выражение для проверки на цифры и точку
    if (!allowedChars.test(pastedData)) {
      event.preventDefault();
    }
  });

// обеспечиваем текстовый ввод в окно калькулятора
inputWindow.addEventListener ('keydown', function(event) {
    checkSuccess(); // очистить экран ввода, если вставка делается после =
    var pressedKey = event.key; // console.log(event.keyCode);
    if (!allowedChars.test(pressedKey) && !allowedKeys.includes(pressedKey))  {
        event.preventDefault();
      }    
})

document.getElementById('btn_clr').addEventListener('click', function () {
    firstOperand = '';
    secondOperand = '';
    operation = '';
    result = '';
    inputWindow.value = '0'; // помещаем 0 в поле ввода
})

// Обработка нажатия кнопки Равно/Result [=]

document.getElementById('btn_result').addEventListener('click', function () {
  if (inputWindow.value && firstOperand && operation) {
            inputStr = inputWindow.value;
            secondOperand = inputStr.slice(inputStr.lastIndexOf(operation)+1);
            calculate();
          };
});

// обработчик кнопки [+]

document.getElementById('btn_plus').addEventListener('click', function () {
  // console.log(`Input: ${inputWindow.value}\nFirst: ${firstOperand}\nSecond: ${secondOperand}\nOperation: ${operation}`);
  // допускаем ввод оператора + только если уже есть первый операнд
  // запрещаеем дублирование ввода текущего оператора +
  // упрощаем конструкцию ввода, исключая множественное сложение

  if (operation) {return};

  if (inputWindow.value && inputWindow.value !== '-'
        && !secondOperand && (operation !== '+')) {
            firstOperand = inputWindow.value; // забираем строку из инпута в первый операнд
            inputWindow.value += '+';
            operation = '+';
            secondOperand = null; // обнуляем второй операнд            
          };
});

// обработчик кнопки [-]
document.getElementById('btn_minus').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если вставка делается после =

  if (firstOperand && operation && !negSecondOperand) {
    // не меняем тип операции, чтобы позволить ввод отрицательного второго операнда
    inputWindow.value += '-';
    negSecondOperand = true; // второй операнд отрицательный
    return;
  };

  if (inputWindow.value == '' || inputWindow.value == '0') {
    inputWindow.value = '-'; // позволяем ввести первое число со знаком минус
    return;
  };

  if (inputWindow.value != '-' && inputWindow.value && !operation) {
            firstOperand = inputWindow.value; // забираем строку из инпута в первый операнд
            inputWindow.value += '-';
            operation = '-';
            negSecondOperand = true; //  второй операнд отрицательный
          };
});


document.getElementById('btn_multiply').addEventListener('click', function () {
  // допускаем ввод оператора и создание операнда-1, только если их еще не было
  // запрещаем ввод нового оператора
  if (inputWindow.value && !firstOperand && !operation) {
            firstOperand = inputWindow.value; // забираем строку из инпута в первый операнд
            inputWindow.value += '*';
            operation = '*';            
          };
});

// Обработчик ввода десятичной точки [.]
//  0.ХХХХ[operation]0.XXX
// -0.YYY[*]-0.YYYY  или -Y.YYY[*]Y.YYYY

document.getElementById('btn_point').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  console.log ('Current input:',inputWindow.value, '; firstOperand = ',firstOperand, '; operation = ',operation);
  if (inputWindow.value == '0' || inputWindow.value == '') {
    inputWindow.value = '0.';
    comma1 = true;
    return;
  };
  if (inputWindow.value == '-' || inputWindow.value == '-0') {
    inputWindow.value = '-0.';
    comma1 = true;
    return;};
  if (inputWindow.value && !comma1) {
    inputWindow.value += '.';
    comma1 = true;
    console.log('we are here!');
    return;
  };

  if (firstOperand && operation && !comma2) {
    inputWindow.value += '.';
    comma2 = true;
    return;
  }
  // дополняем точку нулем, если новое выражение начато с точки
  // inputWindow.value += (inputWindow.value == '0') ? '.': '0.'; 
})

document.getElementById('btn_0').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '0';
})

document.getElementById('btn_1').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '1';
})

document.getElementById('btn_2').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '2';
})

document.getElementById('btn_3').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '3';
})

document.getElementById('btn_4').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '4';
})

document.getElementById('btn_5').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '5';
})

document.getElementById('btn_6').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '6';
})

document.getElementById('btn_7').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '7';
})

document.getElementById('btn_8').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '8';
})

document.getElementById('btn_9').addEventListener('click', function () {
  checkSuccess(); // очистить экран ввода, если ввод делается после =
  inputWindow.value += '9';
})