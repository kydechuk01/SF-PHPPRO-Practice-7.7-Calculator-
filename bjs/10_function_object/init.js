let initPerson;

function generatePerson () {
    
    initPerson = personGenerator.getPerson();
    document.querySelector('#firstNameOutput').innerText = initPerson.firstName;
    document.querySelector('#genderOutput').innerText = initPerson.gender;
    document.querySelector('#birthYearOutput').innerText = initPerson.birthText;
    document.querySelector('#lastNameOutput').innerText = initPerson.lastName;
    document.querySelector('#patronymNameOutput').innerText = initPerson.patronymName;
    document.querySelector('#professionOutput').innerText = initPerson.profession;
    
    // Вычисляем число полных лет
    var today = new Date();
    birthDate = new Date(initPerson.birthYear, initPerson.birthMonth, initPerson.birthDay);
    age = Math.floor((today-birthDate)/1000/60/60/24/365.25);
    
    // Выбираем окончание для фразы ХХ лет по правилам русского языка
    let ageText = age.toString();
    let ageEnd = age % 10;    
    if (age % 100 >= 10 && age % 100 <= 20) { ageText +=' лет' }
    else if ( ageEnd === 1 ) { ageText += ' год' }
    else if ( ageEnd >= 2 && ageEnd <= 4) { ageText +=' года' }
    else if ( ageEnd === 0 || ageEnd >= 5 && ageEnd <= 9) { ageText +=' лет' };

    document.querySelector('#ageCalc').innerText = ageText;
}

function resetPerson () {
    initPerson = {};

    document.querySelector('#firstNameOutput').innerText = 'Имя';
    document.querySelector('#genderOutput').innerText = 'Гендер';
    document.querySelector('#birthYearOutput').innerText = 'ДД Месяц ГГГГ';
    document.querySelector('#lastNameOutput').innerText = 'Фамилия';
    document.querySelector('#patronymNameOutput').innerText = 'Отчество';
    document.querySelector('#professionOutput').innerText = 'Профессия';
    document.querySelector('#ageCalc').innerText = 'Возраст';
}

window.onload = function()
{
    generatePerson();    
    document.querySelector('#btnRefresh').addEventListener('click', generatePerson);
    document.querySelector('#btnReset').addEventListener('click', resetPerson);
   
};

