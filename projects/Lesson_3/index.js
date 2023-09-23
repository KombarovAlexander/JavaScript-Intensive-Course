import './index.html';
import 'bootstrap/dist/css/bootstrap.css'; // импортируем bootstrap
// С этим импортом при попытке запуска тестов jest выдает ошибку "Jest encountered an unexpected token",
// т.к. пытается декодировать файл bootstrap.min.css и не может этого сделать.
// Решение: ставим npm install --save-dev identity-obj-proxy
// Проверяем, что в файле package.json есть
// "devDependencies": {
//   "identity-obj-proxy": "^3.0.0",
//   ...
// }
// Далее, в файле jest.config.js сборки добавляем секцию в module.exports -
// moduleNameMapper: {
//     '\\.(css|less)$': 'identity-obj-proxy',
// },

// Задание 4.1 Создать элемент div с заданным текстом
function createDivWithText(text) {
  const divElem = document.createElement('div');
  divElem.textContent = text;
  return divElem;
}

const btn41 = document.querySelector('#btn41');
btn41.addEventListener('click', event => event.target.parentNode.appendChild(createDivWithText('Текст для div')));


// Задание 4.2 Вставляем элемент в начало указанного
const prepend = (what, where) => where.prepend(what);

const miracleButton = document.querySelector('#miracle');
const what = document.querySelector('#one');
const where = document.querySelector('#two');
const host = document.querySelector('#host');

// При каждом нажатии кнопки меняем ее родителя на противоположный (host или where), чтобы кнопка "прыгала" туда-сюда
miracleButton.addEventListener('click', () => prepend(what, what.parentElement === host ? where : host));


// Задание 4.3 Список дочерних элементов, соседями которых являются элементы <p>
function findAllPSiblings(where) {
  const elemArr = [];
  for (const childElement of where.children) {
    if (
      childElement.nextElementSibling &&
      childElement.nextElementSibling.tagName === 'P'
    ) {
      elemArr.push(childElement);
    }
  }
  return elemArr;
}

// Для элемента source берем HTML-код и помещаем его в innerText элемента target (лучше, если это будет элемент <code>)
const showHTMLCode = (source, target) => target.innerText = `${source.outerHTML}`; // отображаем HTML-код заданного элемента в указанном
                                                                                   // текстовом контейнере на HTML-странице

const startElement = document.querySelector('#div-1');
const code1 = document.querySelector('#code-1');
const btn43 = document.querySelector('#btn43');
const answer43 = document.querySelector('#answer43');

showHTMLCode(startElement, code1);
btn43.addEventListener('click', () => answer43.innerText = `[ ${findAllPSiblings(startElement)?.map(el => el.outerHTML).join(' ,  ')} ]`);


// Задание 4.4 Список текстового содержимого элементов
function findError(where) {
  const textOfElemArr = [];
  for (const childElement of where.children) {
    if (childElement.textContent !== '') {
      textOfElemArr.push(childElement.textContent);
    }
  }
  return textOfElemArr;
}
const btn44 = document.querySelector('#btn44');
btn44.addEventListener('click', () => answer43.innerText = `[ ${findError(startElement)} ]`);


// Задание 4.5 Удалить все дочерние текстовые узлы (без рекурсии)
const code2 = document.querySelector('#code-2');
const rootCont = document.querySelector('#div0'); // контейнер, где хранится наш div1
let simplElement = document.querySelector('#div1'); // let потому что мы будем переопределять div1
const btnDel = document.querySelector('#btnDel');
const btnRecover = document.querySelector('#btnRecover'); // кнопка восстановления исходного кода div1
let simpleFragmentHTML = simplElement.outerHTML; // при загрузке страницы запоминаем "эталонное" состояние div1
showHTMLCode(simplElement, code2); // отрисовываем HTML-код div1 на странице

function deleteTextNodes(where) {
  for (let i = 0; i < where.childNodes.length; i++) { // where.childNodes.length меняется по мере удаления текстовых эл-ов из where
    const el = where.childNodes[i];
    if (el.nodeType === Element.TEXT_NODE) {
      where.removeChild(el); // удаление дочернего узла у where
      i--; // корректировка счетчика [указателя] при удалении дочернего эл-та из where на 1 позицию назад
    }
  }
}

btnRecover.addEventListener('click', () => { // восстановление исходного состояния на момент загрузки страницы
  rootCont.removeChild(simplElement); // удаляем из div0 дочерний эл-т div1
  rootCont.innerHTML = simpleFragmentHTML; // помещаем в div0.innerHTML "эталонный" div1
  simplElement = document.querySelector('#div1'); // перепривязываем к переменной simplElement div1
  showHTMLCode(simplElement, code2); // отрисовываем HTML-код div1 на странице
});
btnDel.addEventListener('click', () => {
  deleteTextNodes(simplElement); // удаляем элемент
  showHTMLCode(simplElement, code2); // заново отрисовываем HTML-код div1 на странице
});


// Задание 4.6 Удалить все дочерние текстовые узлы (рекурсия)
const btnDelR = document.querySelector('#btnDelR');

function delTxtNodesRec(where) {
  for (let i = 0; i < where.childNodes.length; i++) {
    const el = where.childNodes[i];
    if (el.nodeType === Element.TEXT_NODE) {
      where.removeChild(el); // удаление дочернего узла у where, если это текст
      i--; // возврат на 1 позицию назад по DOM-дереву, поскольку мы только что изменили его строение (удалили текстовый эл-т)
    } else if (el.nodeType === Element.ELEMENT_NODE) { // если не текстовый эл-т, то вызываем рекурсивно delTxtNodesRec()
      delTxtNodesRec(el);
    }
  }
}
btnDelR.addEventListener('click', () => {
  delTxtNodesRec(simplElement); // удаляем элемент
  showHTMLCode(simplElement, code2); // отрисовываем HTML-код div1 на странице
});


// Задание 4.7 Статистика по узлам DOM-дерева (рекурсия)
function collectDOMStat(root) {
  const stat = {
    tags: {},
    classes: {},
    texts: 0,
  };

  function scan(root) {
    for (const child of root.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) { // если текстовый элемент - увеличиваем статистику
        stat.texts++;
      } else if (child.nodeType === Node.ELEMENT_NODE) { //если не текстовый эл-т, то
        if (child.tagName in stat.tags) { // если уже есть такой тег - увеличиваем статистику по нему
          stat.tags[child.tagName]++;
        } else { // иначе добавляем в объект тег и его счетчик ставим в 1
          stat.tags[child.tagName] = 1;
        }
        for (const className of child.classList) { // для текущего эл-та собираем статистику по классам
          if (className in stat.classes) { // если такой класс уже есть в объекте - увеличиваем счетчик
            stat.classes[className]++;
          } else {
            stat.classes[className] = 1; // иначе - вносим и инициализируем 1
          }
        }
        scan(child); // рекурсивно вызываем scan() для child - уходим вниз по дереву
      }
    }
  }


  scan(root); // начинаем сбор статистики по переданному в collectDOMStat() узлу root
  return stat; // возвращаем объект со статистикой
}

const btnStats = document.querySelector('#btnStats');
const code3 = document.querySelector('#code-3');

// JSON.stringify() здесь для того, чтобы выводить объект с форматированием, а не слепленным в одну строку
btnStats.addEventListener('click', () => code3.innerText = `${JSON.stringify(collectDOMStat(simplElement), null, 5)}`);


// Задание 4.8 Отслеживание изменений в DOM-дереве
 function observeNodes(where, fn) {
  const observer = new MutationObserver((mutations) => { // создаем новый MutationObserver
    mutations.forEach((mutation) => { // для всех изменений проверяем...
      if (mutation.type === 'childList') { // если изменение - childList, то..
        fn({
          type: mutation.addedNodes.length ? 'insert' : 'remove', // определяем тип изменения - либо insert, либо remove
          nodes: [
            ...(mutation.addedNodes.length ? mutation.addedNodes : mutation.removedNodes), // передаем в массив либо список узлов из удаленных, либо список узлов из добавленных
          ],
        }); // задаем вызов некоторой пользовательской ф-ции, которая будет вызываться при событии изменения
      }
    });
  });
  observer.observe(where, { childList: true, subtree: true }); // создаем observer с параметрами: учитывать изменения во всех дочерних узлах
}

const deleteElem = document.querySelector('#btnDlt');
const addedElem = document.querySelector('#btnAdd');
const btnRecvr = document.querySelector('#btnRecvr');
const code48 = document.querySelector('#code48');
let deletedElement = document.querySelector('#div3');
let insertInElement = document.querySelector('#p1');

function delElem(where) { // Функция удаляет заданный элемент
  where.remove();
}

function addElem(where) { // Функция добавляет в заданный элемент элементы
  const todos = [
    'Задача 1',
    'Задача 2',
    'Задача 3',
    'Задача 4',
    'Задача 5',
    'Задача 6',
    'Задача 7',
  ];
  const ul = document.createElement('ul');

  for (const todo of todos) {
    const li = document.createElement('li');
    li.textContent = todo;
    ul.append(li);
  }

  where.appendChild(ul);
}

showHTMLCode(simplElement, code48);
observeNodes(simplElement, (el) => alert(`В DOM-дереве произошли изменения:: \n\ ${JSON.stringify(el, ['type', 'nodes', 'nodeName', 'id', 'className'], 2)}`)); // вызываем функцию создания observer, указываем элемент наблюдения, задаем fn - просто выводить в консоль переданный объект

deleteElem.addEventListener('click', function () { // вешаем на кнопку удаление элемента
  delElem(deletedElement);
  showHTMLCode(simplElement, code48);
});

btnRecvr.addEventListener('click', function () { // вешаем на кнопку восстановление исходного состояния HTML-разметки контейнера
  rootCont.removeChild(simplElement); // удаляем из div0 дочерний эл-т div1
  rootCont.innerHTML = simpleFragmentHTML; // помещаем в div0.innerHTML "эталонный" div1
  simplElement = document.querySelector('#div1'); // перепривязываем к переменной simplElement div1
  deletedElement = document.querySelector('#div3'); // перепривязываем к переменной simplElement div3
  insertInElement = document.querySelector('#p1');
  showHTMLCode(simplElement, code48); // отрисовываем HTML-код div1 на странице
  observeNodes(simplElement, (el) => alert(`В DOM-дереве произошли изменения: \n\ ${JSON.stringify(el, ['type', 'nodes', 'nodeName', 'id', 'className'], 2)}`)); // После восстановления исходного состояния HTML-разметки переопределяем observer
});

addedElem.addEventListener('click', () => {
                                                        addElem(insertInElement);
                                                        showHTMLCode(simplElement, code48);
                                                      }); // будем добавлять элемент после <p id='p1'></p>


// Задание 5.1 Промис в resolve через sec секунд
// URL списка городов для задания 5.2: https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

const delayPromise = sec => new Promise(resolve => setTimeout(() => resolve(sec), sec * 1000));

const secValue = 3;
const timerSpan = document.querySelector('#timerSpan');
timerSpan.innerText = `${secValue} сек.`; // декоратор над кнопкой запуска таймера


const startTimerPromis = document.querySelector('#startTimerPromis');
startTimerPromis.addEventListener('click', () =>
  delayPromise(secValue)
    .then(() => alert(`Запущенный promise перешел в состояние resolved спустя ${secValue} секунд`))
    .catch(() => alert('Запущенный promise перешел в состояние reject'))
);

// Задание 5.2 Промис загружающий массив городов с url
const townURL =
  'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

function loadAndSortTowns() {
  return fetch(townURL) // Возвращает промис Response (только заголовок)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        //если статус между 200 и 300
        return Promise.resolve(response); //переводим текущий промис (который в then()) в состояние resolve и идем дальше
      } else {
        return Promise.reject(new Error(response.statusText)); // иначе переводим текеущий промис в reject и создаем исключительную ситуацию
        // с обработкой в catch() и передачей в нее текста ошибки из response.statusText
      }
    })
    .then((response) => response.json()) // получаем из response содержимое json
    .then((data) => data.sort((a, b) => a.name.localeCompare(b.name))); // полученное содержимое (а это массив объектов) сортируем по
  // содержимому ключа name. Этот отсортированный по name массив и
  // будет возвращен вызовом loadAndSortTowns()
  // сортировка: если строки равны - вернется 0, если первая строка
  // должна быть выше, чем вторая, то -1, и если первая должна быть
  // ниже второй, то 1.
  //  .catch(error => console.log(`Запрос завершился с ошибкой ${error}`))
}

const startBtnFetch = document.querySelector('#startBtnFetch');
startBtnFetch.addEventListener('click', () =>
  loadAndSortTowns()
    .then((data) => alert(JSON.stringify(data, null, 2)))
    .catch((error) => alert(`Запрос завершился с ошибкой ${error}`))
);

// Задание 5.3 Загрузка городов и фильтрация поиска

// Помещаем элементы разметки в переменные
const loadingBlock = document.querySelector('#loading-block');
const loadingFailed = document.querySelector('#loading-failed');
const filterBlock = document.querySelector('#filter-block');
const filterResult = document.querySelector('#filter-result');
const retryButton = document.querySelector('#retry-button');
const filterInput = document.querySelector('#filter-input');
const errorMassage = document.querySelector('#error-massage');
const loadTownButton = document.querySelector('#loadTownButton');
let towns = []; // массив для загрузки городов, первоначально пуст

function managingElementVisibility(visible, ...args) { // управляем видимостью переданных элементов
  if (args) {
    // если массив args существует, то
    for (const arg of args) {
      if (visible) {
        // если visible = true
        arg.classList.remove('hidden'); // для всех элементов из args удаляем класс hidden: classList.remove('hidden')
      } else {
        // если visible = false
        arg.classList.add('hidden'); // для всех элементов из args добавляем класс hidden: classList.add('hidden')
      }
    }
  }
}

async function loadTown() {
  towns = []; // перед загрузкой очистим массив
  errorMassage.textContent = ''; // чистим содержимое <p> с сообщением об ошибке
  managingElementVisibility(true, loadingBlock); // делаем видимым блок загрузки: "идет загрузка"
  try {
    towns = await loadAndSortTowns(); // пытаемся загрузить города в массив и отсортировать
    managingElementVisibility(false, loadingBlock, loadingFailed); // удачная загрузка: прячем блок загрузки ("идет загрузка") и блок неудачной загрузки
    managingElementVisibility(true, filterBlock, filterResult, loadTownButton); // удачная загрузка: делаем видимым блок фильтра, блок результата фильтрования и кнопку загрузки городов
    filterResult.innerHTML = ''; // на всякий случай чистим результаты фильтра
  } catch (error) {
    // обработка ошибки загрузки массива городов
    managingElementVisibility(false, loadingBlock, filterBlock, loadTownButton); // неудачная загрузка: прячем блок загрузки ("идет загрузка"), блок фильтра и кнопку загрузки городов
    managingElementVisibility(true, loadingFailed); // неудачная загрузка: делаем видимым блок неудачной загрузки
    errorMassage.textContent = `Загрузка городов завершилась с ошибкой: ${error}`; // пишем в <p> текст сообщения об ошибке
  }
}

loadTownButton.addEventListener('click', () => loadTown()); // вешаем на кнопку обработчик события click: выполнить загрузку городов loadTown()
retryButton.addEventListener('click', () => loadTown()); // вешаем на кнопку обработчик события click: выполнить загрузку городов loadTown()

function updateFilterResult(filterValue) {
  // Обновляет содержимое элемента <div> filterResult; необходимо вызывать при каждом вводе
  // нового символа в filterInput
  const documentFragment = document.createDocumentFragment(); //создаем DocumentFragment, чтобы помещать в filterResult сразу все строки
  filterResult.innerHTML = ''; // чистим содержимое элемента <div> filterResult

  for (const town of towns) {
    // перебираем массив городов.. (был вариант с towns.filter(), но он такой же громоздкий, не лучше...)
    if (filterValue && town.name.toUpperCase().includes(filterValue.toUpperCase())) {
      // если передали не пустую строку filterValue
      // и переданная строка содержится в текущем элементе
      // массива городов, то...
      const townNameP = document.createElement('p'); // создаем элемент <p>
      townNameP.textContent = town.name; // пишем в него название текущего города
      documentFragment.append(townNameP); // добавляем этот элемент <p> в DocumentFragment
    }
  }
  filterResult.append(documentFragment); // добавляем documentFragment с отфильтрованными строками в filterResult
}

filterInput.addEventListener('input', function () {
  // вешаем обработчик событий на ввод символов
  updateFilterResult(filterInput.value); // вызываем updateFilterResult для каждого ввода символа
});

managingElementVisibility(false, loadingBlock, loadingFailed, filterBlock, filterResult); // изначально прячем все блоки

export {
  createDivWithText,
  prepend,
  findAllPSiblings,
  findError,
  deleteTextNodes,
  delTxtNodesRec,
  collectDOMStat,
  observeNodes,
  delayPromise,
  loadAndSortTowns,
  loadTown,
};
