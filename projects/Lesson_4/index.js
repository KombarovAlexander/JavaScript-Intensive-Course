import './index.html';
import 'bootstrap/dist/css/bootstrap.css';

// ДЗ номер 6.1: написать функцию, добавляющую обработчик события к указанному элементу
function addListener(eventName, target, fn) {
  try {
    target.addEventListener(eventName, fn);
    target.textContent = `${target.id} ${textTargetEventHandlerOn} "${eventName}"`;
  } catch (e) {
    alert(
      `Установить обработчик события "${eventName}" на элемент ${target} невозможно по следующей причине: ${e}`
    );
  }
}

const addEventListenerButton = document.querySelector('#addEventListenerButton');
const targetButton = document.querySelector('#targetButton');
const textTargetEventHandlerOff = `${targetButton.id} Обработчик события отсутствует`;
const textTargetEventHandlerOn = `Установлен обработчик события`;

targetButton.textContent = textTargetEventHandlerOff;
addEventListenerButton.textContent = `Установить обработчик события на элемент ${targetButton.id}`;

// Если функцию callbackFn задать анонимно в addListener(), то позднее удалить подвешенное событие по анонимной функции будет невозможно, теряется ссылка на нее
const callbackFn = event =>
  alert(`Отработал обработчик события ${event.type} на элементе ${event.target.id}`);
addEventListenerButton.addEventListener('click', () =>
  addListener('click', targetButton, callbackFn)
);

// ДЗ номер 6.2: написать функцию, удаляющую обработчик события у указанного элемента
const removeEventListenerButton = document.querySelector('#removeEventListenerButton');
removeEventListenerButton.textContent = `Удалить обработчик события у элемента ${targetButton.id}`;

function removeListener(eventName, target, fn) {
  try {
    target.removeEventListener(eventName, fn);
    target.textContent = `Удален обработчик события "${eventName}" у элемента ${target.id}`;
    target.textContent =  textTargetEventHandlerOff;
  } catch (e) {
    alert(
      `Удалить обработчик события "${eventName}" у элемента ${target} невозможно по следующей причине: ${e}`
    );
  }
}

removeEventListenerButton.addEventListener('click', () =>
  removeListener('click', targetButton, callbackFn)
);

// ДЗ номер 6.3: написать функцию, отменяющую действия по умолчанию у указанного элемента
function customPreventDefault(event) { // Функция, которая запрещает действие по умолчанию и всплытие события
  event.preventDefault(); //отменяем стандартные действия браузера
  event.stopPropagation(); //отменяем всплытие события (протыкаем пузырь), без этого отключения действия по умолчанию для yandexURL отключались еще до нажатия кнопки preventDefaulBtutton
  alert(`Для элемента ${event.target.id} действие по умолчанию запрещено.`);
}
function addRemoveClasses(target, addList, removeList) {
  if (addList) target.classList.add(...addList);
  if (removeList) target.classList.remove(...removeList);
}
const skipDefault = (eventName, target, parentTarget) =>{ // Добавляет или удаляет обработчик события eventName для элемента target
  if (!target.customEvents || !target.customEvents.length) { // target.customEvents - кастомное свойство, чтобы отслеживать, вешали мы что-то в качестве обработчика на target или нет
    target.customEvents = []; // если перечень наших кастомных обработчиков пустой, то помещаем в него наш обработчик customPreventDefault
    target.customEvents.push(customPreventDefault);

    target.addEventListener(eventName, customPreventDefault); // добавляем к target обработчик customPreventDefault для события eventName

    addRemoveClasses(parentTarget, ['btn-danger'], ['btn-success']); // меняем надписи и css кнопки и ссылки
    addRemoveClasses(target, ['btn-danger'], ['btn-outline-primary']);
    parentTarget.innerText = `Действие по умолчанию у ссылки ${target.innerText} запрещено`;
  } else {
    target.customEvents.pop(); // если в target.customEvents что-то есть, то удаляем один элемент из этого массива

    target.removeEventListener(eventName, customPreventDefault); // удаляем событие customPreventDefault у элемента target

    addRemoveClasses(parentTarget, ['btn-success'], ['btn-danger']); // меняем надписи и css кнопки и ссылки
    addRemoveClasses(target, ['btn-outline-primary'], ['btn-danger']);
    parentTarget.innerText = preventDefaulBtuttonText;
  }
}

const preventDefaulBtutton = document.querySelector('#preventDefaulBtutton');
const yandexURL = document.querySelector('#yandexURL');
let preventDefaulBtuttonText = `Запретить действие по умолчанию у ссылки ${yandexURL.innerText}`;
preventDefaulBtutton.innerText = preventDefaulBtuttonText;

// Обработчик на кнопку preventDefaulBtutton, вызывает skipDefault, которая устанавливает обработчик на ссылку yandexURL
preventDefaulBtutton.addEventListener('click', event => skipDefault('click', yandexURL, preventDefaulBtutton));


// ДЗ номер 6.4: написать функцию, эмулирующую click на указанном элементе

const emulateClickButton = document.querySelector('#emulateClickButton'); // кнопка, при нажатии которой произойдет эмуляция click на кнопке targetBtn
const targetBtn = document.querySelector('#targetBtn'); // кнопка, нажатие которой будет эмулироваться

const emulateClick = target => target.dispatchEvent(new MouseEvent('click')); // функция, эмулирующая наступление события на элементе target
const eventHandler = event => alert(`Для элемента ${event.target.id} произошло событие ${event.type}.`); // функция-обработчик события

targetBtn.addEventListener('click', eventHandler); // на кнопку target вешаем обработчик события eventHandler
emulateClickButton.addEventListener('click', event => emulateClick(targetBtn)); // событие при клике на кнопке emulateClickButton
                                                                                           // - вызов ф-ции emulateClick() для targetBtn

// ДЗ номер 6.5: написать функцию, реагирующую только на клики по элементам BUTTON внутри target
const homeworkContainer = document.querySelector('#homeworkContainer'); // контейнер, в котором расположены button
let delegateMessageStr = ''; // часть строки для вывода в alert, приходится собирать эту строку в 2-х местах, чтобы выводить тип события

function delegate(target, fn) { // функция, назначающая обработчик события для контейнера с кнопками
  target.addEventListener('click', event => {
    delegateMessageStr = `Событие "${event.type}" произошло на элементе "${event.target.parentElement.id}",`; // часть строки для вывода в alert с типом события
    if (event.target.tagName === 'BUTTON') { // если событие от контейнера погрузилось до кнопок, то вызываем ф-цию fn()
      fn(event.target);
    }
  });
}

// ф-ция, которая вызывается в обрработчике события, если событие от контейнера погрузилось до кнопок
const delegateCallbackFn = target => alert(`${delegateMessageStr} перехвачено на элементе "${target.id}" благодаря механизму погружения.`);

delegate(homeworkContainer, delegateCallbackFn); // вызов функции delegate с передачей в нее homeworkContainer и callback-функции


// ДЗ номер 6.6: написать функцию, добавляющую элементу target событие, срабатывающее только 1 раз
const setOnceEventBtutton = document.querySelector('#setOnceEventBtutton');
const onceEventTargetBtutton = document.querySelector('#onceEventTargetBtutton');
let onceEventTargetBtuttonText = `Приемник одноразового события`; // начальный текст для кнопки-приемника
onceEventTargetBtutton.innerText = onceEventTargetBtuttonText;

function once(target, fn) { // получает кнопку-приемник и функцию, которая должна быть вызвана в обработчике события click этой кнопки
  target.innerText = `Одноразовое событие на элементе-приемнике ${target.id} установлено`; // изменения класса и текста на кнопке приемнике
  addRemoveClasses(target, ['btn-danger'], ['btn-outline-primary']); // меняет css кнопки на danger
  const onceListener = (event) => { // функция-обработчик, которую мы повесим на событие клика кнопки-приемника одноразового события
    // обработчик выполняет функцию, которую мы передаем в once(), т.е. fn()
    fn(event.target);
    event.target.removeEventListener('click', onceListener); // затем удаляет обработчик события кнопки-приемника (по сути сам себя), который мы повесили на кнопку-приемник ниже
    addRemoveClasses(target, ['btn-outline-primary'], ['btn-danger']); // возвращение исходного вида (класса и текста) кнопки-приемника после снятия с нее одноразового события
    target.innerText = onceEventTargetBtuttonText;
  };
  target.addEventListener('click', onceListener); // на кнопку-приемник вешаем событие с обработчиком onceListener
}
// кнопка-установщик события на кнопку-приемник; вызывает функцию once(), которая этот одноразовый обработчик события и устанавливает на кнопку-приемник
setOnceEventBtutton.addEventListener('click', () =>
  once(onceEventTargetBtutton, (target) => alert(`Одноразовый обработчик события на элементе-приемнике ${target.id} выполнился и отключен`))
);

// ДЗ номер 6.*: Создавать D'n'D Div'ы
const rootContainer = document.querySelector('#homeworkContainerOne'); // контейнер, куда будем помещать div'ы
const addDiv = document.querySelector('#addDiv'); // кнопка, которая будет создавать div'ы

const randomInt = (minValue, maxValue) =>
  Math.ceil(Math.random() * (maxValue - minValue) + minValue); // получаем случайное число из диапазона min-max
const setDivColor = () =>
  `rgb(${randomInt(0, 255)} ${randomInt(0, 255)} ${randomInt(0, 255)})`; // получаем случайный цвет

// в rootContainerWidth передаем rootContainerWidth.clientWidth (число) и возвращаем тоже число, т.к. потребуется для вычисления позиции div'а
const setDivWidth = (rootContainerWidth, ratio) =>
  randomInt(15, Math.floor(rootContainerWidth / ratio)); // устанавливаем случайную ширину div'а
// ratio - коэфф., допустим, div не может превышать
// 1/4 ширины родительского контейнера,
// следовательно, min будет 15 пикселей (мельче смысла нет),
// а max - 1/4 ширины контейнера
const setDivHeight = (rootContainerHeight, ratio) =>
  randomInt(15, Math.floor(rootContainerHeight / ratio));
const setDivLeft = (rootContainerWidth, rootContainerOffsetLeft, divWidth) =>
  `${
    Math.floor(Math.random() * (rootContainerWidth - (divWidth + 20))) +
    20 +
    rootContainerOffsetLeft
  }px`;
// случайное положение Left
// div'а, исходя из его размера, размера родительского контейнера,
// смещения родительского контейнера влево относительно страницы
// (rootContainerOffsetLeft) и отступов внутри родительского контейнера (20)
const setDivTop = (rootContainerHeight, rootContainerOffsetTop, divHeight) =>
  `${
    Math.floor(Math.random() * (rootContainerHeight - (divHeight + 20))) +
    20 +
    rootContainerOffsetTop
  }px`;

//Собираем строку style для div'а с его размерами, положением и цветом
const makeCSSStyle = (divWidth, divHeight, divTop, divLeft, divColor) =>
  `width:${divWidth}px; height:${divHeight}px; top:${divTop}; left:${divLeft}; background-color:${divColor}; position: absolute;`;
let maxZIndex = 0; // максимальный Z-индекс в контейнере на данный момент
function makeDiv(rootContainer, ratio) {
  // создаем div в контейнере
  const divWidth = setDivWidth(rootContainer.clientWidth, ratio); // собираем параметры создаваемого элемента
  const divHeight = setDivHeight(rootContainer.clientHeight, ratio);
  const divTop = setDivTop(
    rootContainer.clientHeight,
    rootContainer.offsetTop,
    divHeight
  );
  const divLeft = setDivLeft(
    rootContainer.clientWidth,
    rootContainer.offsetLeft,
    divWidth
  );
  const divColor = setDivColor();
  const divStrStyle = makeCSSStyle(divWidth, divHeight, divTop, divLeft, divColor); // закидываем эти параметры в строку стиля
  const divElement = document.createElement('div'); // создаем элемент
  divElement.classList.add('draggable-div');
  divElement.style.cssText = divStrStyle; // забрасываем в него строку стиля
  divElement.draggable = true; // разрешаем для этого элемента Drag'n'Drop
  divElement.style.zIndex = ++maxZIndex; // Назначаем элементу z-index и увеличиваем значение максимального z-index'а - maxZIndex
  rootContainer.appendChild(divElement); // добавляем элемент в контейнер
  //divElement.style.backgroundColor = divColor;
  return divElement;
  //console.log(divElement.style.zIndex);
}

function makeDnD(rootContainer) {
  //вешаем на контейнер обработчики событий DnD
  let currentDrag; // изначально undefined, заполняется при обработке события начала переноса

  rootContainer.addEventListener('dragstart', (event) => {
    currentDrag = {
      // если событие наступило, запоминаем начальное состояние переноса
      source: rootContainer, // контейнер, где начался перенос
      node: event.target, // элемент, который начали переносить
      posX: event.pageX, // начальное положение по Х (совпадает (почти) с координатой Х, где произошло событие)
      posY: event.pageY, // то же самое, но по Y
    };
    event.dataTransfer.effectAllowed = 'move'; // параметры переноса - указываем, что идет перемещение
    event.dataTransfer.setData('text/html', event.target.getAttribute('id')); // данные - текст, храним id переносимого элемента
    event.dataTransfer.setDragImage(event.target, 10, 10); // смещение курсора мыши от верхнего левого угла перемещаемого объекта

    //console.log(currentDrag);
  });

  rootContainer.addEventListener('dragover', (event) => {
    event.preventDefault(); // без отмены действия по умолчанию не наступает событие drop
  });

  // вычисляем позицию по Х при отпускании элемента в дроп-зоне:
  // если текущая позиция курсора (и левого верхнего угла элемента event.pageX) находится от правой границы контейнера на расстоянии,
  // меньшем, чем ширина перетаскиваемого элемента, то мы позицию Х корректируем:
  // сдвигаем эту позицию влево на расстояние, равное разности между шириной перетаскиваемого элемента (currentDrag.node.clientWidth) и
  // зазором между правой границей контейнера и текущим положением левого верхнего угла элемента event.pageX
  const setElementLeft = (currentDrag, posX) =>
    currentDrag.source.clientWidth + currentDrag.source.offsetLeft - posX <
    currentDrag.node.clientWidth
      ? `${
          posX -
          (currentDrag.node.clientWidth -
            (currentDrag.source.clientWidth + currentDrag.source.offsetLeft - posX))
        }px`
      : `${posX}px`;
  // аналогично - по высоте и по Y
  const setElementTop = (currentDrag, posY) =>
    currentDrag.source.clientHeight + currentDrag.source.offsetTop - posY <
    currentDrag.node.clientHeight
      ? `${
          posY -
          (currentDrag.node.clientHeight -
            (currentDrag.source.clientHeight + currentDrag.source.offsetTop - posY))
        }px`
      : `${posY}px`;

  rootContainer.addEventListener('drop', (event) => {
    if (currentDrag) {
      // если currentDrag не undefined, т.е. если мы вообще что-то начали переносить
      event.preventDefault(); // отменяем действие по умолчанию

      currentDrag.node.style.left = setElementLeft(currentDrag, event.pageX); // определяем и устанавливаем left для отпускаемого элемента

      currentDrag.node.style.top = setElementTop(currentDrag, event.pageY); // то же для Top

      currentDrag.node.style.zIndex = ++maxZIndex; // Увеличиваем z-index элемента до максимума в контейнере + 1 (будет поверх всех div'ов в контейнере)

      currentDrag = null; // перенос завершен, чистим currentDrag
    }
  });
}

makeDnD(rootContainer);
addDiv.addEventListener('click', () => makeDiv(rootContainer, 4));

// ДЗ номер 7.1 - 7.3: Куки
const table = document.querySelector('#cookieTable');
const cookieName = document.querySelector('#cookieName');
const cookieValue = document.querySelector('#cookieValue');
const cookieExpires = document.querySelector('#cookieExpires');
const addCookie = document.querySelector('#addCookie');
const filterCookie = document.querySelector('#filterCookie');

// если хотя бы один аргумент - '', то false, набор cookie считается не заполненным
const isFill = (...args) =>
  args.filter((element) => element === '')?.length > 0 ? false : true;

function clearCookieInputValue() {
  // чистим поля ввода данных cookie
  document
    .querySelector('#inputDiv')
    .querySelectorAll('input')
    .forEach((element) => (element.value = ''));
}

function setCookie(name, value, expires) {
  // устанавливаем cookie по переданным значениям Имя, Значение, Количество дней
  if (isFill(name, value, expires) && Number(expires)) {
    // если все поля заполненны и expires - число, то...
    document.cookie = `${encodeURIComponent(name.trim())}=${encodeURIComponent(
      value.trim()
    )};max-age=${encodeURIComponent(expires.trim()) * 86400};SameSite=None;Secure`; // устанавливаем cookie
    clearCookieInputValue(); // чистим поля ввода
    return true;
  } else {
    alert(`Не все значения cookie корректно заполнены`);
    return false;
  }
}

//получаем объект, в котором перечислены все имеющиеся на данный момент cookie в формате <имя: значение>
const getAllCookies = () =>
  document.cookie.split('; ').filter(Boolean).reduce((objCookies, element) => {
                  let [cName, cValue] = element.split('=');
                  objCookies[cName] = cValue;
                  return objCookies;
                  }, {});

/*const getAllCookies = () => document.cookie // альтернатива с регуляркой
                            .split('; ') //формируем из строки массив строк с разделителем '; '
                            .filter(Boolean) // избавляемся от "пустоты": аналог .filter(el => Boolean(el)) - вернет только не пустые эл-ты, если все пустое - вернет []
                            .map((cookie) => cookie.match(/^([^=]+)=(.+)/)) // регулярка: строка должна начинаться на первую группу от одного символа, но исключать знак =;
                                                                                         // далее в строке ожидается знак =; за ним - вторая группа от одного символа
                                                                                         // регулярку можно заменить вторичным сплитом по знаку = и убрать map()
                            .reduce((obj, [,name, value]) => { // с предыдущего шага мы получаем массив ["<строка целиком>", "<содержимое группы 1>", "<содержимое группы 2>"]
                                                              // нас интересуют только "<содержимое группы 1>" и "<содержимое группы 2>" - строку целиком пропускаем
                                          obj[name] = value;
                                          return obj;
                                    }, {}); */

const deleteCookie = (name) =>
  (document.cookie = `${encodeURIComponent(
    name.trim()
  )}='';max-age=-1;SameSite=None;Secure`); //удаляет cookie по имени
function deleteRow(target) {
  // удаляет cookie и строку с cookie из таблицы cookie
  const deletedRow = target.parentElement.parentElement; // получили строку таблицы cookie, которую надо удалить
  // (первый parentElement - ячейка, а parentElement.parentElement - строка таблицы)

  deleteCookie(deletedRow.cells[0].innerHTML); // удалили cookie, соответствующие удаляемой строке таблицы cookie
  table.deleteRow(deletedRow.rowIndex); // удаляем из таблицы cookie строку по ее индексу
}

function addTableRow(target, name, value) {
  // добавляет в таблицу cookie строку с именем, значением и кнопкой "Удалить cookie"
  const regExpPhrase = new RegExp(filterCookie.value, 'i'); // регулярка по содержимому поля фильтрации таблицы
  const row = document.createElement('tr');
  const cellName = document.createElement('td');
  const cellValue = document.createElement('td');
  const cellDelete = document.createElement('td');
  const deleteButton = document.createElement('button');

  addRemoveClasses(deleteButton, ['btn', 'btn-outline-primary', 'btn-sm']); // добавляем css-классы для кнопки deleteButton
  deleteButton.addEventListener('click', (event) => deleteRow(event.target)); // вешаем на созданную кнопку обработчик удаления cookie и соответствующей строки из таблицы cookie
  cellName.innerHTML = name;
  cellValue.innerHTML = value;
  deleteButton.textContent = 'Удалить cookie';
  cellDelete.append(deleteButton);

  row.append(cellName, cellValue, cellDelete);

  row.style.display = regExpPhrase.test(name) || regExpPhrase.test(value) ? '' : 'none'; // если добавляемые name или value совпали с
  // регуляркой поля фильтрации таблицы, то делаем строку таблицы видимой и добавляем в таблицу
  // иначе - делаем строку невидимой, но тоже добавляем в таблицу

  target.getElementsByTagName('tbody')[0].appendChild(row); // добавляем строку в tbody таблицы
}

function findedNameUpdateValueInTable(table, name, value) {
  // ищем в таблице имя cookie (нулевые ячейки в каждой строке)
  const regExpPhrase = new RegExp(filterCookie.value, 'i'); // регулярка по содержимому поля фильтрации таблицы
  for (let i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].innerHTML === name) {
      // если нашли соответствие, то...
      table.rows[i].cells[1].innerHTML = value; // обновляем значение coockie для найденного имени (первые ячейки в каждой строке)
      table.rows[i].style.display =
        regExpPhrase.test(name) || regExpPhrase.test(value) ? '' : 'none'; // если есть совпадение
      // с регуляркой по полю ввода фильтрации, то показываем строку в таблице, если нет - то не показываем.
      return true; // если нашли - возвращаем true
    }
  }
  return false; // не нашли
}

function addRowCookie(target, name, value, expires) {
  // для вызова по нажатию кнопки: добавляем cookie и строку в таблицу cookie
  if (!setCookie(name, value, expires)) return; // если setCookie() вернула false - выходим, параметры куки не валидные, иначе -  устанавливаем cookie
  if (!findedNameUpdateValueInTable(target, name, value)) {
    // если соответствие имени cookie в таблице не найдено, то...
    addTableRow(target, name, value); // добавляем в таблицу cookie новую строку
  }
}

function initTable(target) {
  // при запуске приложения в таблицу cookie добавляем все имеющиеся на этот момент cookie
  const listCookies = getAllCookies();
  Object.keys(listCookies).forEach((key) => addTableRow(target, key, listCookies[key]));
  console.log(listCookies);
}

function tableFiltering(targetTable, inputPhrase) {
  const regExpPhrase = new RegExp(inputPhrase.value, 'i'); // регулярка по содержимому поля ввода
  // когда у нас поле ввода пустое, регулярка принимает значение (?:) - т.е. всегда будут найдены строки-совпадения нулевой длинны,
  // т.е. будут найдены совпадения во всех ячейках таблицы

  let flag = false; // флаг совпадения, изначально false
  console.log(regExpPhrase);
  for (let i = 1; i < targetTable.rows.length; i++) {
    // i начинаем перебирать с 1 для того, чтобы не фильтровать заголовок таблицы
    flag = false; // для каждой новой строки таблицы флаг совпадения текста - false
    for (let j = table.rows[i].cells.length - 2; j >= 0; j--) {
      // обратный цикл до ....length - 2 для того, чтобы не фильтровать 3-й
      // столбец с кнопкой "Удалить" (2 можно передавать как параметр - кол-во
      // анализируемых столбцов слева)
      flag = regExpPhrase.test(targetTable.rows[i].cells[j].innerHTML); // выставляем значение флага совпадения по результату
      // сравнения регулярки и содержимого ячейки
      if (flag) break; // если есть совпадение - выходим из цикла перебора ячеек
    }
    if (flag) {
      // если совпадение в ячейке есть - вся ее строка видима
      targetTable.rows[i].style.display = '';
    } else {
      targetTable.rows[i].style.display = 'none'; // если совпадений нет - делаем строку невидимой
    }
  }
}

filterCookie.addEventListener('input', (event) => tableFiltering(table, event.target));

initTable(table);
console.log(document.querySelector('#inputDiv').querySelectorAll('input'));
addCookie.addEventListener('click', () =>
  addRowCookie(table, cookieName.value, cookieValue.value, cookieExpires.value)
);

export {
  addListener,
  delegate,
  emulateClick,
  once,
  removeListener,
  skipDefault,
  makeDiv,
  getAllCookies,
};
