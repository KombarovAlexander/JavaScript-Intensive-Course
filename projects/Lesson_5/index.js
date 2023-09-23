// Модули:
/*
  5. Точка входа, index.js - служит для инициализации web-приложения:
        логин в VK, заполнение шаблона заголовка; использует model.js, view.js, в сборке webpack требуется еще и router.js
  1. model.js - служит для получения и манипуляций с данными от VK; реализованы методы авторизации на VK login,
     вызова методов API VK (общий) - callAPI(), на его основе реализованы методы вызова конкретных методов API - getUser,
     getFriends и getNews
  2. view.js - служит для отображения полученных из model.js данных; с помощью шаблонов handlebars формирует html-разметку
     для карточек друзей пользователя VK с уже внедренными в них данными, полученными от model.js. Реализует один метод -
     render(), который в зависимости от переданного шаблона и данных возвращает функцию handlebars, генерирующую текст готовой
     разметки
  3. controller.js - прослойка между Model [model.js] и View [view.js]: умеет обращаться к Model и получать данные, умеет
     обращаться к View [view.js] и получать на основе шаблонов handlebars html-разметку для карточек друзей пользователя
     VK с уже внедренными в них данными, полученными от Model [model.js]. Реализованы 2 метода: friendsRoute() и newsRoute(),
     каждый из которых, вызывая различные комбинации методов Model и View, отображает либо карточки друзей, либо карточки новостей
     залогинившегося пользователя VK
  4. router.js - прослойка между контроллером [controller.js] и UI: в зависимости от выбранного пользователем в UI варианта,
     роутер формирует нужное имя метода контроллера [controller.js] и вызывает его. Реализован 1 метод - handle(), получающий
     от UI название "пути", по которому надо пройти всю цепочку получения и отображения данных, чтобы отобразить в UI контент,
     запрошенный пользователем web-приложения.
*/
// ******* Главное достоинство - удобство масштабирования приложения: с минимумом усилий мы можем добавлять новый функционал,
// например, очень быстро и просто мы можем получить и отобразить список фото, видео и т.д. залогинившегося аккаунта VK

// ***************** VMC *****************

import 'bootstrap/dist/css/bootstrap.min.css'; // подключаем сюда bootstrap-стили, чтобы не писать свои; предварительно
                                               // необходимо установить командой npm install bootstrap; более обширную
                                               // интеграцию bootstrap в webpack (плагины и т.д.) - см. в документации bootstrap;
                                               // перечень названий css-классов для различных контролов - см. в документации bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // импорт необходим для того, чтобы отрабатывали обработчики событий - например клик по выпадающему списку
import Handlebars from 'handlebars/dist/handlebars'; // handlebars импортируем сюда для того, чтобы здесь зарегистрировать
                                                     // хелперы (см. ниже), форматирующие в данных, встраиваемых в шаблон, дату
                                                     // и время
import './index.html'; // подключение модулей, использующихся в точке входа
import Model from './MVC/model.js';
import View from './MVC/view.js';
import Router from './MVC/router.js';

const APP_ID = xxxxxxxx; // Полученный в VK при регистрации приложения его Id

Handlebars.registerHelper('formatTime', time => { // хелпер handlebars, форматирующий время в данных шаблона; объявляется здесь,
                                                  // т.к. будет использован в index.html
  let minutes = (time / 60).toFixed();
  let seconds = time - minutes * 60;

  minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
  seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

  return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', ts => { // хелпер handlebars, форматирующий дату в данных шаблона
  return new Date(ts * 1000).toLocaleString();
});


(async () => {
  try {
    await Model.login(APP_ID, 2 | 8192); // логинимся в VK как приложение (зарегистрировано ранее в VK), 2 | 8192 - разрешения
    let [me] = await Model.getUser({name_case: 'gen'}); // при успешном ответе от login() запрашиваем пользователя страницы (сохроняем в me)
                                                          // метод из Model (getUser), параметр {name_case: 'gen'} - в родительном падеже
    const header = document.querySelector('#header'); // получаем в переменную div для header'а
    header.innerHTML = View.render('header', me); // загружаем в div header'а сгенерированный шаблон с данными о пользователе VK

    document.addEventListener('click', event => { // вешаем обработчик события на документ и проверяем, есть ли
                                                            // у event.target data-атрибут route (делегируем сразу на документ)
      let {route} = event.target.dataset; // пытаемся забрать у event.target значение data-атрибута route:
                                          // атрибут, если он есть, хранится в event.target.dataset.{route: '<путь>'};
                                          // выполняем деструктуризацию по объекту и если в event.target.dataset есть ключ route,
                                          // то его значение останется в переменной route ('friends', 'news', ...), иначе в этой
                                          // переменной будет null
    //  console.log(route);
      if (route) {
        Router.handle(route);
      }
  //    console.log(event.target);
    });

  } catch (err) { // обработка ошибки
    console.error(err);
    alert('Ошибка: ' + err.message);
  }
  })(); // ф-ция ассинхронная, анонимная, объявили ее - и сразу вызываем
const divResult = document.querySelector('#result');
// Обработка прокрутки гороизонтального скрола
divResult.addEventListener('wheel', event => {event.preventDefault(); event.currentTarget.scrollLeft += event.deltaY;});

// ***************** MVVM *****************

const bindElements = document.querySelectorAll('*[data-bind]'); // выбираем все элементы, имеющие атрибут data-bind
const bindingEnabled = document.querySelector('#bindingEnabled');
const bindMap = {}; // карта соответствий, каким элементам какие данные интересны, подписка на данные
                     // ключ - значение data-bind (данные), значение - массив элементов, где эти данные фигурируют, т.е.
                     // {
//                          firstName: [
//                            input, div, span и т.д.
//                          ] ...
                     // }
const scope = {}; // Накопитель новых значений для data-bind
/*
Как пример: начинаем ввод в <input> firstName имени "Антон". На каждый ввод у нас в scope образуется пара:
{firstName: "А"}, затем значение меняется на {firstName: "Ан"}, затем на {firstName: "Ант"} и т.д. и так идет установка значений
при соответствующем событии для всех значений bindName

*/

for (let element of bindElements) {
  let bindTo = element.dataset.bind; // атрибут элемента, начинающийся на "data-" - пользовательский, к нему можно получить
                                     // доступ через element.dataset; обращаться надо по имени, стоящем после data-... атрибута,
                                     // т.е. если атрибут data-bind = "old", то получить его значение мы можем как element.dataset.bind
                                     // т.о. здесь мы получаем значение атрибута data-bind текущего элемента, т.е.
                                     // для data-bind = "old" в  bindTo будет "old", т.е. забираем значение атрибута data-bind
                                     // у текущего элемента
  // console.log(bindTo);
  if (!bindMap[bindTo]) { // если в bindMap пока нет такого ключа, который сейчас находится в bindTo, то...
    bindMap[bindTo] = [] // добавляем его и устанавливаем его значение, равным [] (пустой массив)
  }
  bindMap[bindTo].push(element); // добавляем в массив элементов соответствующего ключа новый элемент
}
//console.log(bindElements);
//console.log(bindMap);

function bindValue(bindingName, value) {
  scope[bindingName] = value;
}

function syncBindings(target) { // разбрасывает изменения в scope по элементам DOM-дерева, которых эти изменения касаются
  for (let bindTo in scope) { // перебор всех ключей в scope
    let value = scope[bindTo]; // берем значение, которое хранится в scope под текущим ключом
    for (let element of bindMap[bindTo]) { // начинаем перебирать в карте соответствий bindMap для текущего ключа bindTo
                                           // все элементы массива, которые под ним хранятся, т.е. перебираем все элементы
                                           // в карте соответствий (приемники), которые заинтересованы в изменившихся
                                           // данных текущего источника
      if (element !== target) { // проверяем, что элемент в карте соответствий не target, не источник этих изменений, чтобы
                                // и его не апдейтить, а только приемники
        if (element.tagName === 'INPUT') { // если текущий элемент input, то
          element.value = value; // присваиваем ему значение, равное value из scope
        } else { // если не input, то
          element.textContent = value; // записываем value в textContent элемента
        }
      }
    }
    delete scope[bindTo]; // удаляем из scope отработаный элемент, он нам больше не нужен, чистим очередь на синхронизацию
  }
}

document.addEventListener('input', element => { // обработчик события вешаем на документ, делегируем
  let target = element.target; // забираем элемент, на котором произошло событие
  let bindTo = target.dataset.bind; // смотрим значение его атрибута data-bind
  if (bindTo && bindMap[bindTo]) { // если у переданного элемента есть атрибут data-bind и такое значение есть в нашей карте
                                   // соответствий bindMap, то...
    bindValue(bindTo, target.value); // обновили в scope текущее значение ключа с именем bindTo
    if (bindingEnabled.checked) { // если не checked, то данные в приемниках не обновляются, а накапливаются в очереди, в scope
      syncBindings(target); // синхронизировали изменения из источника во все приемники
    }
  }
}, true);

bindingEnabled.addEventListener('change', () => { // обработчик события изменения состояния чек-бокса
  if (bindingEnabled.checked) {
    syncBindings(); // вызываем без аргумента target, т.к. мы просто обновляем все приемники и источники содержимым scope
  }
})
