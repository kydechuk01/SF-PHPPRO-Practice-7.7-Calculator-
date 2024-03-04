const personGenerator = {
    lastNameMaleJson: `{  
        "count": 20,
        "list": {
            "id_1": "Иванов",
            "id_2": "Смирнов",
            "id_3": "Кузнецов",
            "id_4": "Васильев",
            "id_5": "Петров",
            "id_6": "Михайлов",
            "id_7": "Новиков",
            "id_8": "Федоров",
            "id_9": "Кравцов",
            "id_10": "Николаев",
            "id_11": "Семёнов",
            "id_12": "Славин",
            "id_13": "Степанов",
            "id_14": "Павлов",
            "id_15": "Александров",
            "id_16": "Морозов",
            "id_17": "Волков",
            "id_18": "Козлов",
            "id_19": "Орлов",
            "id_20": "Макаров"
        }
    }`,
    firstNameMaleJson: `{
        "count": 15,
        "list": {     
            "id_1": "Александр", 
            "id_2": "Максим", 
            "id_3": "Иван", 
            "id_4": "Артем", 
            "id_5": "Дмитрий",
            "id_6": "Никита",
            "id_7": "Михаил",
            "id_8": "Даниил", 
            "id_9": "Егор", 
            "id_10": "Андрей",
            "id_11": "Федор", 
            "id_12": "Константин", 
            "id_13": "Алексей",
            "id_14": "Илья",
            "id_15": "Кирилл"
        }
    }`,
    firstNameFemaleJson: `{
        "count": 15,
        "list": {     
            "id_1": "София",
            "id_2": "Анна",
            "id_3": "Мария",
            "id_4": "Ева",
            "id_5": "Варвара",
            "id_6": "Виктория",
            "id_7": "Полина",
            "id_8": "Алиса",
            "id_9": "Ксения",
            "id_10": "Екатерина",
            "id_11": "Дарья",
            "id_12": "Анастасия",
            "id_13": "Вероника",
            "id_14": "Кира",
            "id_15": "Василиса"
            }
    }`,
    jobJson: `{
        "count": 15,
        "list": {
            "id_1": {
                "profession": "Программист",
                "gender": "any"
            },
            "id_2": {
                "profession": "Шахтер",
                "gender": "male"
            },
            "id_3": {
                "profession": "Бухгалтер",
                "gender": "any"
            },
            "id_4": {
                "profession": "Менеджер по продажам",
                "gender": "any"
            },
            "id_5": {
                "profession": "Маркетолог",
                "gender": "any"
            },
            "id_6": {
                "profession": "Преподаватель",
                "gender": "any"
            },
            "id_7": {
                "profession": "Медицинский работник",
                "gender": "any"
            },
            "id_8": {
                "profession": "Юрист",
                "gender": "any"
            },
            "id_9": {
                "profession": "Переводчик",
                "gender": "any"
            },
            "id_10": {
                "profession": "Танцор",
                "gender": "male"
            },
            "id_11": {
                "profession": "Танцовщица",
                "gender": "female"
            },
            "id_12": {
                "profession": "Психолог",
                "gender": "any"
            },
            "id_13": {
                "profession": "Военный",
                "gender": "male"
            },
            "id_14": {
                "profession": "Ткачиха",
                "gender": "female"
            },
            "id_15": {
                "profession": "Доярка",
                "gender": "female"
            }
        }
    }`,

    GENDER_MALE: 'Мужчина',
    GENDER_FEMALE: 'Женщина',

    /* Генератор случайного числа между min и max */
    randomIntNumber: function (min = 0, max = 1) {
        return Math.floor(Math.random() * (max - min + 1) + min);
        },

    /* Возвращает случайную запись с id_N из передаваемого объекта
       Номер записи N получаем от функции генераци сл.числа, куда
       передаем число записей (.count) в передаваемом объекте.
    */
    randomValue: function (json) {
        const obj = JSON.parse(json); // парсим входящий JSON-объект в JS-объект
        const prop = `id_${this.randomIntNumber(1, obj.count)}`;  // this = personGenerator
        return obj.list[prop];
    },

    /* Возвращаем случайное имя из набора Мужских имен */
    randomFirstMaleName: function () {
        return this.randomValue(this.firstNameMaleJson);
    },
    
    /* Возвращаем случайное имя из набора Женских имен */
    randomFirstFemaleName: function () {
        return this.randomValue(this.firstNameFemaleJson);
    },

    /* Возвращаем случайное имя согласно гендера */
    randomFirstName: function () {
        switch (this.person.gender) {
            case this.GENDER_MALE: return this.randomFirstMaleName();
            case this.GENDER_FEMALE: return this.randomFirstFemaleName();
            }
        return '[ERR] Ошибка в гендере персоны!';
    },

    /* Возвращаем случайную фамилию согласно гендера */
    randomLastName: function () {
        let lastName = this.randomValue(this.lastNameMaleJson); // берем базовую случайную мужскую фамилию
        switch (this.person.gender) {
            case this.GENDER_MALE: return lastName;
            case this.GENDER_FEMALE: return `${lastName}а`; // для женских фамилий добавляем окончание "-а"
            }
        return '[ERR] Ошибка в гендере персоны!';
    },
    
    /* Возвращаем случайное отчество с коррекцией на гендер */
    randomPatronymName: function () {
        /*  "id_5": "Дмитрий",  ий -> иевич иевна
            "id_6": "Никита",   та -> тович товна
            "id_7": "Михаил",   ил -> йлович йловна
            "id_10": "Андрей",  ей -> еевич еевна
            "id_14": "Илья",    ья -> ьич ьинична
        */
        let patronymic = this.randomValue(this.firstNameMaleJson);
        let ending = patronymic.slice(-2);
        let patLen = patronymic.length;

        // console.log('Пол:', this.person.gender, 'отчество от:', patronymic, 'окончание', ending);

        switch (this.person.gender) {
            case this.GENDER_MALE: {
                // обработка исключительных окончаний для отчества
                switch (ending) {
                    case 'ий': { patronymic = patronymic.slice(0, patLen - 2) + 'иевич'; break };
                    case 'та': { patronymic = patronymic.slice(0, patLen - 2) + 'тович'; break };
                    case 'ла': { patronymic = patronymic.slice(0, patLen - 2) + 'лович'; break };                    
                    case 'ил': { 
                        if (patronymic.slice(-3) === 'аил') {patronymic = patronymic.slice(0, patLen - 2) + 'йлович'} else {patronymic = patronymic.slice(0, patLen - 2) + 'илович'};
                         break};                        
                    case 'ей': { patronymic = patronymic.slice(0, patLen - 2) + 'еевич'; break };
                    case 'ья': { patronymic = patronymic.slice(0, patLen - 2) + 'ьич'; break };
                    default: { patronymic = patronymic + 'ович'; break };
                };
                return patronymic;
            };
            case this.GENDER_FEMALE: {
                // обработка исключительных окончаний для отчества
                switch (ending) {
                    case 'ий': { patronymic = patronymic.slice(0, patLen - 2) + 'иевна'; break };
                    case 'та': { patronymic = patronymic.slice(0, patLen - 2) + 'товна'; break };
                    case 'ла': { patronymic = patronymic.slice(0, patLen - 2) + 'ловна'; break };
                    case 'ил': { 
                                if (patronymic.slice(-3) === 'аил') {patronymic = patronymic.slice(0, patLen - 2) + 'йловна'} else {patronymic = patronymic.slice(0, patLen - 2) + 'иловна'};
                                 break};                        
                    case 'ей': { patronymic = patronymic.slice(0, patLen - 2) + 'еевна'; break };
                    case 'ья': { patronymic = patronymic.slice(0, patLen - 2) + 'ьинична'; break };
                    default: { patronymic = patronymic + 'овна'; break };
                };
                return patronymic;
            };
        };
        return '[ERR] Ошибка в гендере персоны!';
    },

    /* Возвращаем случайную профессию согласно гендера */

    randomProfession: function () {
        let searchJob = true;
        let job = null;
        while (searchJob) {
            job = this.randomValue(this.jobJson); // берем базовую случайную профессию
            // перебираем профессии, пока не найдем подходящую под гендер персонажа
            if (job.gender === 'any') { searchJob = false }
            else if (job.gender === 'male' && this.person.gender === this.GENDER_MALE) { searchJob = false }
            else if (job.gender === 'female' && this.person.gender === this.GENDER_FEMALE) { searchJob = false };
        };
        return job.profession;
    },
    
    /* 
      Генерируем случайные год рождения, месяц и дату с учетом високосных годов 
    */

    randomBirthDate: function () {
        
        const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const monthMaxDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // макс число дней в месяце

        let year = this.randomIntNumber(1930, 2010);
        let month = this.randomIntNumber(1, 12);
        let monthTxt = MONTHS[month - 1]; // текстовый вариант названия месяца
        
        // проверка на високосный год
        let leapYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
        
        let maxDay;

        // определяем максимальный день в месяце
        if (month !== 2) { maxDay = monthMaxDay[month-1] }
        else { maxDay = (leapYear) ? 29 : 28 }; // февраль
        
        // генерируем день из заданного промежутка
        let day = this.randomIntNumber(1, maxDay);

        birthText = `${day} ${monthTxt} ${year} г.`;
        return [birthText, year, month, day];
    },

    /* Возвращает случайное значение: 'Мужчина' или 'Женщина' */
    randomGender: function () {
        return (this.randomIntNumber() === 1) ? this.GENDER_MALE : this.GENDER_FEMALE;
    },

    /*  генерация
        нового
        персонажа */
   
    getPerson: function () {
        this.person = {};
        [this.person.birthText, this.person.birthYear, this.person.birthMonth, this.person.birthDay] = this.randomBirthDate();
        this.person.gender = this.randomGender(); // 'Мужчина' или 'Женщина'
        this.person.firstName = this.randomFirstName();
        this.person.lastName = this.randomLastName();
        this.person.patronymName = this.randomPatronymName()
        this.person.profession = this.randomProfession();
        return this.person;
    }
};
