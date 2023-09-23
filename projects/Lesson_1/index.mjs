//Домашнее задание. Неделя 1. 'Переменные и функции'

//Задание 1.1
let returnFirstArgument = anyParam => anyParam;

console.log(' ');
console.log('Задание 1.1 - Напишите функцию, возвращающую аргумент, переданный ей в качестве параметра.');
console.log('returnFirstArgument(100) = ', returnFirstArgument(100));
console.log('returnFirstArgument(\'Привет\') = ', returnFirstArgument('Привет'));
console.log(' ');

//Задание 1.2
let sumWithDefaults = (Param1, Param2 = 100) => Param1 + Param2;

console.log('Задание 1.2 - Напишите функцию, возвращающую сумму переданных аргументов, при этом значение по умолчанию второго аргумента должно равняться 100.');
console.log('sumWithDefaults(16, 12) = ', sumWithDefaults(16, 12));
console.log('sumWithDefaults(50) = ', sumWithDefaults(50));
console.log(' ');

//Задание 1.3
let returnFnResult = (word, func) => func(word);

console.log('Задание 1.3 - Напишите функцию, принимающую в качестве одного из аргументов другую функцию, и возвращающую результат вызова этой переданной в нее функции.');
console.log('returnFnResult(\'Слово 1\', word => word + \' слово 2\') = ', returnFnResult('Слово 1', word => word + ' слово 2'));
console.log(' ');

//Задание 1.4
let returnCounter = (number = 0) => (() => ++number);
let f = returnCounter(10);

console.log('Задание 1.4 - Напишите функцию, принимающую в качестве аргумента число и возвращающую новую функцию F(), при вызове которой переданное ранее число должно быть увеличено на 1 и возвращено из F().');
console.log('f = returnCounter(10)');
console.log('f() = ', f());
console.log('f() = ', f());
console.log('f() = ', f());
console.log('typeof f() = ', typeof f());
console.log('typeof f = ', typeof f);
console.log(' ');

//Задание 1.5
let returnArgumentsArray = (...args) => args;

console.log('Задание 1.5 - Напишите функцию, возвращающую все переданные ей аргументы в виде массива; количество переданных аргументов заранее неизвестно.');
console.log('returnArgumentsArray(4, 5, 78, 58, 100, 1325) = ', returnArgumentsArray(4, 5, 78, 58, 100, 1325));
console.log('returnArgumentsArray(92, false, [5, 8, \'nn\'], { a: \'aa\', num: 25}, 987, 1974) = ', returnArgumentsArray(92, false, [5, 8, 'nn'], { a: 'aa', num: 25}, 987, 1974));
console.log('returnArgumentsArray() = ', returnArgumentsArray());
console.log(' ');

//Задание 1.6
let sumThree = (a = 0, b = 0, c = 0) => a + b + c;
let bindFunction = (inFunc,...args) => inFunc.bind(null,...args);
let newSum = bindFunction(sumThree, 1, 2, 3);

console.log('Задание 1.6 - Написать функцию, принимающую другую функцию F() и некоторое количество аргументов, которая привязывает переданные аргументы к переданной функции F() и возвращает получившуюся функцию.');
console.log('newSum() = ', newSum()); // вызов возвращаемой ф-ции через промежуточную переменную newSum
console.log('bindFunction(sumThree, 1, 2, 3)() = ', bindFunction(sumThree, 1, 2, 3)()); // вызов напрямую: получаем ф-цию из вызова bindFunction(sumThree, 1, 2, 3) и тут же вызываем ее ()
console.log(' ');

//Задание 1.7
let arrNum = [];
function pingPong(startValue, endValue){
  arrNum.push(startValue++);
  if (startValue <= endValue) {
    pingPong(startValue, endValue);
  }
  arrNum.push(--startValue);
}

console.log('Задание 1.7 - С помощью рекурсии напишите функцию, собирающую следующую последовательность чисел: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.');
pingPong(1,10);
console.log('pingPong(1,10): ', arrNum.join(', '));
console.log(' ');

//Задание 1.8
const object = {
    div: {
      p: 'sdsdsd',
      main: {
        div: 'dfdfd',
        address: {
          menu: 'menu'
        },
        p: {
          span: {
            em: 'sdsdsd',
            html: 'html'
          }
        },
        footer: 'hkhkhh'
      }
    },
    header: {
        div: {
          span: {
              b: 'kgkgkg',
              logic: false,
              num: 123,
              arr: [23, 56, 731]
          }
        }
    }
}

const stats = {
  texts: [],
  tags: []
}

function getStats(root) {
  for (const tag in root){

    if (root[tag] instanceof Object){ // если текущий элемент - объект или наследник объекта, то...
      stats.tags.push(tag); // помещаем ключ в массив ключа tags объекта stats
      getStats(root[tag]); // рекурсивный вызов getStats от текущего элемента-объекта объекта root
    } else { // иначе
      stats.texts.push(root[tag]); // помещаем текстовое значение ключа в массив ключа texts объекта stats
      stats.tags.push(tag); // помещаем ключ в массив ключа tags объекта stats
    }

  }
}
console.log('Задание 1.8 - С помощью рекурсии напишите функцию, обходящую объект и собирающую по нему статистику по ключам и их значениям; в результате работы функции все ключи должны быть помещены в массив tags, все значения ключей, которые не являются объектами или их наследниками, - в массив texts, а сами массивы должны быть помещены в объект stats.');
getStats(object);
console.log(stats);

export {returnFirstArgument,
        sumWithDefaults,
        returnFnResult,
        returnCounter,
        returnArgumentsArray,
        bindFunction,}; // экспорт тестируемых функций для модуля index.spec.js

