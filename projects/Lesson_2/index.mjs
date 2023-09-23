//Домашнее задание. Неделя 2. 'Объекты и массивы. Обработка ошибок'

// Задание 2.1
function forEach(callbackFn,curArray = []) {
  for (let i =0; i < curArray.length; i++){
    callbackFn(curArray[i], i, curArray);
  }
}

console.log(' ');
console.log('Задание 2.1 - Напишите аналог метода forEach() для работы с массивами (использовать методы массивов js нельзя).');
console.log('Метод forEach() для массива [23, 45, 56] и callback-функции  el => console.log(el): ');
forEach(el => console.log(el), [23, 45, 56]);
console.log('Метод forEach() для массива [23, 45, 56] и callback-функции  el => console.log(el**2): ');
forEach(el => console.log(el**2), [23, 45, 56]);
console.log('');



// Задание 2.2
function map(callbackFn,curArray = []) {
  let modArr = [];
  for (let i =0; i < curArray.length; i++){
    modArr[i] = callbackFn(curArray[i], i, curArray);
  }
  return modArr;
}

console.log('Задание 2.2 - Напишите аналог метода map() для работы с массивами (использовать методы массивов js нельзя).');
console.log('Результат вызова map(el => el**2, [1 ,2, 3]): ', map(el => el**2, [1 ,2, 3]));
console.log('Результат вызова map(el => el**2, []): ', map(el => el**2, []));
console.log('');



// Задание 2.3
function reduce(callbackFn, curArray = [], initial) {
  let hasInitial = typeof initial !== 'undefined'; // Проверка: есть в переданных аргументах initial
  let accumValue = hasInitial ? initial : curArray[0]; // Начальное значение accumValue равно initial (если есть) или curArray[0] (если нет)
  for (let i = hasInitial ? 0 : 1; i < curArray.length; i++) { // Если initial задан, то для accumValue перебираем эл-ты с curArray[0],
                                                               // т.к. в этом случае начальное accumValue = initial,
                                                               // иначе с curArray[1], т.к. в этом случае начальное accumValue = curArray[0]
    accumValue = callbackFn(accumValue, curArray[i], i, curArray);
  }
  return accumValue;
}

console.log('Задание 2.3 - Напишите аналог метода reduce() для работы с массивами (использовать методы массивов js нельзя).');
console.log('Результат вызова reduce((accum, current) => accum + current, [1, 2, 3, 4, 5]): ', reduce((accum, current) => accum + current, [1, 2, 3, 4, 5]));
console.log('Результат вызова reduce((accum, current) => accum + current, [1, 2, 3, 4, 5], 10): ', reduce((accum, current) => accum + current, [1, 2, 3, 4, 5], 10));
console.log('Результат вызова reduce((accum, current) => accum + current, [], 7): ', reduce((accum, current) => accum + current, [], 7));
console.log('');



// Задание 2.4
let upperProps = curObj => Object.keys(curObj) // получили ключи верхнего уровня
                            // в map() смотрим, является ли значение ключа объектом; если да - пишем ключ в результирующий массив
                            // и рекурсивно вызываем upperProps() для значения этого ключа, если нет - просто пишем ключ
                           .map(key => typeof curObj[key] === 'object' ? [ key.toUpperCase(), ...upperProps(curObj[key])] : key.toUpperCase())
                           .toString().split(','); // после map() имеем массив вложенных массивов; переводим в строку
                           // и после split() получаем плоский массив

console.log('Задание 2.4 - Напишите функцию, перебирающую все свойства переданного объекта и возвращающую массив их имен в верхнем регистре.');
console.log('Результат вызова upperProps({name: \'Сергей\', secondName: \'Петрович\', family: \'Иванов\'}): ', upperProps({name: 'Сергей', secondName: 'Петрович', family: 'Иванов'}));
console.log('Результат вызова upperProps({person: {name: \'Сергей\', secondName: \'Петрович\', family: \'Иванов\'}, age: 25}): ', upperProps({person: {name: 'Сергей', secondName: 'Петрович', family: 'Иванов'}, age: 25}));
console.log('');



// Задание 2.5
let createProxy = target => new Proxy(target, {set (target, property, value) { // Объект, имя свойства, его значение
             target[property] = (typeof value == 'number') ? value ** 2 : value; // если значение св-ва число - возводим его в квадрат, иначе пишем без изменений
             return true}});

console.log('Задание 2.5 - Напишите функцию, принимающую в качестве аргумента объект и возвращающую Proxy этого объекта, который при попытке записи в объект числовых значений его свойств возводит их в квадрат.');

let obj = {
  testNumberOne: 1,
  testNumberTwo: 1,
  testString: '',
  testBoolean: false
}
obj = createProxy(obj);

console.log('Исходный объект: ', obj);

obj.testNumberOne = 2;
obj.testNumberTwo = 5;
obj.testString = 'Строка';
obj.testBoolean = true;

console.log('Измененный объект: ', obj);
console.log('');



// Задание 3.1
console.log('Задание 3.1 - Напишите функцию, возвращающую true, если все элементы массива удовлетворяют какому-то условию. В случае передачи в функцию пустого массива, либо отсутствия callback-функции, сгенерировать исключение (использовать методы массивов js нельзя).');

function isAllTrue(callbackFn,curArray = []) {
  if (!Array.isArray(curArray) || !curArray.length) throw new Error('empty array');
  if (!(callbackFn instanceof Function)) throw new Error('callbackFn is not a function');
  for (let i =0; i < curArray.length; i++){
    if (!callbackFn(curArray[i])) return false;
  }
   return true;
}

try {
  console.log('Результат вызова isAllTrue(element => element < 10,[1, 2, 3, 4, 5]): ', isAllTrue(element => element < 10,[1, 2, 3, 4, 5]));
  console.log('Результат вызова isAllTrue(element => element < 10,[100, 2, 3, 4, 5]): ', isAllTrue(element => element < 10,[100, 2, 3, 4, 5]));
  //console.log('Результат вызова isAllTrue(element => element < 10,[]): ', isAllTrue(element => element < 10,[]));
  console.log('Результат вызова isAllTrue(true,[1, 2, 3, 4, 5]): ', isAllTrue(true,[1, 2, 3, 4, 5]));
} catch (e) {
  console.log(e.message);
}
console.log('');



// Задание 3.2
console.log('Задание 3.2 - Напишите функцию, возвращающую true, если хотя бы один элемент массива удовлетворяют какому-то условию. В случае передачи в функцию пустого массива, либо отсутствия callback-функции, сгенерировать исключение (использовать методы массивов js нельзя).');

function isSomeTrue(callbackFn,curArray = []) {
  if (!Array.isArray(curArray) || !curArray.length) throw new Error('empty array');
  if (!(callbackFn instanceof Function)) throw new Error('callbackFn is not a function');
  for (let element of curArray){
    if (callbackFn(element)) return true;
  }
  return false;
}

try {
  console.log('Результат вызова isSomeTrue(element => element > 20,[1, 2, 30, 4, 5]): ', isSomeTrue(element => element > 20,[1, 2, 30, 4, 5]));
  console.log('Результат вызова isSomeTrue(element => element > 20,[1, 2, 3, 4, 5]): ', isSomeTrue(element => element > 20,[1, 2, 3, 4, 5]));
  //console.log('Результат вызова isSomeTrue(element => element > 20,[]): ', isSomeTrue(element => element > 20,[]));
  console.log('Результат вызова isSomeTrue(true,[1, 2, 3, 4, 5]): ', isSomeTrue(true,[1, 2, 3, 4, 5]));
} catch (e) {
  console.log(e.message);
}
console.log('');



// Задание 3.3
console.log('Задание 3.3 - Напишите функцию selfCallBack, которая принимает неизвестное количество аргументов, первый из которых - функция fn; функция fn запускается для каждого переданного аргумента. selfCallBack должна вернуть массив аргументов, на которых callback-функция fn вызвала исключение. Функция selfCallBack должна вызывать исключение, если callback-функция fn - не функция.');

function selfCallBack(...args){
  let errArgs = [];
  if (!(args[0] instanceof Function)) throw new Error('selfCallBack error: fn (args[0]) is not a function');
  for (let i = 1; i < args.length; i++) {
    try {
      args[0](args[i]); // Вызываем callback-функцию для текущего элемента
    } catch (err) {
      errArgs.push(args[i]); // Помещаем в массив элементы, на которых функция args[0]() вызвала ошибку
    }
  }
  return errArgs;
}

let evenNumbers = [2, 24, 64, 8];
let oddNumbers = [3, 77, 11];
let isEvenNumber = el => {if (el % 2 !== 0) throw new Error('Число не четное')};

let divFn = el => {if (isNaN(25/el) || !isFinite(25/el)) throw new Error('Делитель должен быть числом и не равняться нулю')};

try {
  console.log('Исходный массив: ', [...evenNumbers, ...oddNumbers]);
  console.log('Callback-функция isEvenNumber вызвала исключения на следующих элементах массива: ', selfCallBack(isEvenNumber, ...evenNumbers, ...oddNumbers));
  console.log(' ');
  console.log('Исходный массив: ', [1, 'sdfdf', 5, {name: 'Ivan'}, 25, [125,85,31], 0, undefined, 2, 72, 'dferfefefef']);
  console.log('Callback-функция divFn вызвала исключения на следующих элементах массива: ', selfCallBack(divFn, 1, 'sdfdf', 5, {name: 'Ivan'}, 25, [125,85,31], 0, undefined, 2, 72, 'dferfefefef'));
  selfCallBack([], ...evenNumbers, ...oddNumbers)
} catch (e) {
  console.log(e.message);
}
console.log('');

// Задание 3.3
function createObj (number = 0) {
  if (!Number.isFinite(number)) {
    throw new Error('number is not a number');
  }
  return {
    number: number,
    sum(...args) {
      let result = number;
      for (const arg of args) {
        result += arg;
      }
      return result;
    },
    dif(...args) {
      let result = number;
      for (const arg of args) {
        result -= arg;
      }
      return result;
    },
    div(...args) {
      let result = number;
      for (const arg of args) {
        if (arg === 0) {
          throw new Error('division by 0');
        }
        result /= arg;
      }
      return result;
    },
    mul(...args) {
      let result = number;
      for (const arg of args) {
        result *= arg;
      }
      return result;
    }
  }
}

try {
  let number = 1;
  let myObj = createObj(number);
  console.log(Object.keys(myObj));
  console.log('Задание 3.4 - Напишите функцию, принимающую числовой параметр number и возвращающую объект, который реализует методы sum, dif, div и mul. Методы должны складывать с number, вычитать из него, делить его и умножать него на передаваемые в методы аргументы (количество аргументов в методах заранее неизвестно). Необходимо обработать исключительные ситуации деления на 0 в методе div() и случая, когда в функцию создания объекта передается значение, не являющееся числом.');
  console.log(`Объект myObj создан с параметром number = ${number}:`);
  console.log('Отработал метод sum: ', myObj.sum(1, 2, 3, 4, 5));
  console.log('Отработал метод dif: ', myObj.dif(1, 2, 3, 4, 5));
  console.log('Отработал метод div: ', myObj.div(1, 2, 3, 4, 5));
  console.log('Отработал метод mul: ', myObj.mul(1, 2, 3, 4, 5));
  console.log('Отработал метод div: ', myObj.div(1, 2, 3, 4, 0));
} catch (e) {
  console.log(e.message);
}

export { createProxy, forEach, map, reduce, upperProps,
         isAllTrue, isSomeTrue, selfCallBack, createObj,};
