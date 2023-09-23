import { randomValue } from '../../scripts/helper';
import {
  createDivWithText,
  deleteTextNodes,
  delTxtNodesRec,
  findAllPSiblings,
  findError,
  collectDOMStat,
  observeNodes,
  prepend,
  delayPromise,
  loadAndSortTowns,
} from './index.js';

function random(type) {
  const result = randomValue(type);

  if (type === 'string') {
    return encodeURIComponent(result);
  }

  return result;
}

describe('ДЗ 4 - Работа с DOM', () => {
  describe('createDivWithText', () => {
    it('должна возвращать элемент с тегом DIV', () => {
      const text = random('string');
      const result = createDivWithText(text);

      expect(result).toBeInstanceOf(Element);
      expect(result.tagName).toBe('DIV');
    });

    it('должна добавлять текст в элемент', () => {
      const text = random('string');
      const result = createDivWithText(text);

      expect(result.textContent).toBe(text);
    });
  });

  describe('prepend', () => {
    it('должна добавлять элемент в начало', () => {
      const where = document.createElement('div');
      const what = document.createElement('p');
      const whereText = random('string');
      const whatText = random('string');

      where.innerHTML = `, <b>${whereText}</b>!`;
      what.textContent = whatText;

      prepend(what, where);

      expect(where.firstChild).toBe(what);
      expect(where.innerHTML).toBe(`<p>${whatText}</p>, <b>${whereText}</b>!`);
    });
  });

  describe('findAllPSiblings', () => {
    it('должна возвращать массив с элементами, соседями которых являются P', () => {
      const where = document.createElement('div');

      where.innerHTML = '<div></div><p></p><span></span><span></span><p></p>';
      const result = findAllPSiblings(where);

      expect(Array.isArray(result));
      expect(result).toEqual([where.children[0], where.children[3]]);
    });
  });

  describe('findError', () => {
    it('должна возвращать массив из текстового содержимого элементов', () => {
      const where = document.createElement('div');
      const text1 = random('string');
      const text2 = random('string');

      where.innerHTML = ` <div>${text1}</div>, <div>${text2}</div>!!!`;
      const result = findError(where);

      expect(Array.isArray(result));
      expect(result).toEqual([text1, text2]);
    });
  });

  describe('delTextNodes', () => {
    it('должна удалить все текстовые узлы', () => {
      const where = document.createElement('div');

      where.innerHTML = ` <div></div>${random('string')}<p></p>${random('string')}`;
      deleteTextNodes(where);

      expect(where.innerHTML).toBe('<div></div><p></p>');
    });
  });

  describe('delTxtNodesRec', () => {
    it('должна рекурсивно удалить все текстовые узлы', () => {
      const where = document.createElement('div');
      const text1 = random('string');
      const text2 = random('string');
      const text3 = random('string');

      where.innerHTML = `<span> <div> <b>${text1}</b> </div> <p>${text2}</p> ${text3}</span>`;
      delTxtNodesRec(where);

      expect(where.innerHTML).toBe('<span><div><b></b></div><p></p></span>');
    });
  });

  describe('collectDOMStat', () => {
    it('должна вернуть статистику по переданному дереву', () => {
      const where = document.createElement('div');
      const class1 = `class-${random('number')}`;
      const class2 = `class-${random('number')}-${random('number')}`;
      const text1 = random('string');
      const text2 = random('string');
      const stat = {
        tags: { P: 1, B: 2 },
        classes: { [class1]: 2, [class2]: 1 },
        texts: 3,
      };

      where.innerHTML = `<p class="${class1}"><b>${text1}</b> <b class="${class1} ${class2}">${text2}</b></p>`;
      const result = collectDOMStat(where);

      expect(result).toEqual(stat);
    });
  });

  describe('observeNodes', () => {
    it('должна вызывать fn при добавлении элементов в указанный элемент', (done) => {
      const where = document.createElement('div');
      const fn = (info) => {
        expect(typeof info === 'object' && info && info.constructor === 'Object');
        expect(info.type).toBe(targetInfo.type);
        expect(Array.isArray(info.nodes));
        expect(info.nodes.length).toBe(targetInfo.nodes.length);
        expect(targetInfo.nodes).toEqual(info.nodes);
        done();
      };
      const elementToInsert = document.createElement('div');
      const targetInfo = {
        type: 'insert',
        nodes: [elementToInsert],
      };

      document.body.appendChild(where);

      observeNodes(where, fn);
      where.appendChild(elementToInsert);

      document.body.removeChild(where);
    });

    it('должна вызывать fn при добавлении множества элементов в указанный элемент', (done) => {
      const where = document.createElement('div');
      const fn = (info) => {
        expect(typeof info === 'object' && info && info.constructor === 'Object');
        expect(info.type).toBe(targetInfo.type);
        expect(Array.isArray(info.nodes));
        expect(info.nodes.length).toBe(targetInfo.nodes.length);
        expect(targetInfo.nodes).toEqual(info.nodes);
        done();
      };
      const elementToInsert1 = document.createElement('div');
      const elementToInsert2 = document.createElement('div');
      const elementToInsert3 = document.createElement('div');
      const targetInfo = {
        type: 'insert',
        nodes: [elementToInsert1, elementToInsert2, elementToInsert3],
      };
      const fragment = new DocumentFragment();

      document.body.appendChild(where);

      fragment.appendChild(elementToInsert1);
      fragment.appendChild(elementToInsert2);
      fragment.appendChild(elementToInsert3);

      observeNodes(where, fn);
      where.appendChild(fragment);

      document.body.removeChild(where);
    });

    it('должна вызывать fn при удалении элементов из указанного элемента', (done) => {
      const where = document.createElement('div');
      const fn = (info) => {
        expect(typeof info === 'object' && info && info.constructor === 'Object');
        expect(info.type).toBe(targetInfo.type);
        expect(Array.isArray(info.nodes));
        expect(info.nodes.length).toBe(targetInfo.nodes.length);
        expect(targetInfo.nodes).toEqual(info.nodes);
        done();
      };
      const elementToRemove = document.createElement('div');
      const targetInfo = {
        type: 'remove',
        nodes: [elementToRemove],
      };

      document.body.appendChild(where);

      where.appendChild(elementToRemove);
      observeNodes(where, fn);
      where.removeChild(elementToRemove);

      document.body.removeChild(where);
    });

    it('должна вызывать fn при удалении множества элементов из указанного элемента', (done) => {
      const where = document.createElement('div');
      const fn = (info) => {
        expect(typeof info === 'object' && info && info.constructor === 'Object');
        expect(info.type).toBe(targetInfo.type);
        expect(Array.isArray(info.nodes));
        expect(info.nodes.length).toBe(targetInfo.nodes.length);
        expect(targetInfo.nodes).toEqual(info.nodes);
        done();
      };
      const elementToRemove1 = document.createElement('div');
      const elementToRemove2 = document.createElement('div');
      const elementToRemove3 = document.createElement('div');
      const targetInfo = {
        type: 'remove',
        nodes: [elementToRemove1, elementToRemove2, elementToRemove3],
      };

      document.body.appendChild(where);

      where.appendChild(elementToRemove1);
      where.appendChild(elementToRemove2);
      where.appendChild(elementToRemove3);

      observeNodes(where, fn);
      where.innerHTML = '';

      document.body.removeChild(where);
    });
  });
});

///////////// ЧАСТЬ 2 /////////////////

const hasOwnProperty = Object.prototype.hasOwnProperty;

describe('ДЗ 6.1 - Асинхронность и работа с сетью', () => {
  describe('delayPromise', () => {
    it('должна возвращать Promise', () => {
      const result = delayPromise(1);

      expect(result).toBeInstanceOf(Promise);
    });

    it('Promise должен быть resolved через указанное количество секунд', (done) => {
      const result = delayPromise(1);
      const startTime = new Date();

      result
        .then(() => {
          expect(new Date() - startTime).toBeGreaterThanOrEqual(1000);
          done();
        })
        .catch(done);
    });
  });

  describe('loadAndSortTowns', () => {
    it('должна возвращать Promise', () => {
      const result = loadAndSortTowns();

      expect(result).toBeInstanceOf(Promise);
    });

    it('Promise должен разрешаться массивом из городов', (done) => {
      const result = loadAndSortTowns();

      result
        .then((towns) => {
          expect(Array.isArray(towns));
          expect(towns.length).toBe(50);
          towns.forEach((town, i, towns) => {
            expect(hasOwnProperty.call(towns, 'name'));

            if (i) {
              expect(towns[i - 1].name.localeCompare(town.name)).toBeLessThanOrEqual(0);
            }
          });
          done();
        })
        .catch(done);
    });
  });
});

//const hasOwnProperty = Object.prototype.hasOwnProperty;

describe('ДЗ 6.2 - Фильтр городов', () => {
  const filterPage = require('./index.js');
  const homeworkContainer = document.querySelector('#root53');
  let loadingBlock;
  let filterBlock;
  let filterInput;
  let filterResult;

  beforeAll(() => filterPage.loadTown());

  describe('Функциональное тестирование', () => {
    describe('loadTowns', () => {
      it('должна возвращать Promise', () => {
        const result = filterPage.loadTown();
        expect(result).toBeInstanceOf(Promise);
      });

      it('Promise должен разрешаться массивом из городов', (done) => {
        /* eslint-disable max-nested-callbacks */
        const result = filterPage.loadAndSortTowns();

        result
          .then((towns) => {
            expect(Array.isArray(towns));
            expect(towns.length).toBe(50);
            towns.forEach((town, i, towns) => {
              expect(hasOwnProperty.call(town, 'name'));

              if (i) {
                expect(towns[i - 1].name.localeCompare(town.name)).toBeLessThanOrEqual(0);
              }
            });
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Интеграционное тестирование', () => {
    loadingBlock = homeworkContainer.querySelector('#loading-block');
    filterBlock = homeworkContainer.querySelector('#filter-block');
    filterInput = homeworkContainer.querySelector('#filter-input');
    filterResult = homeworkContainer.querySelector('#filter-result');

    it('на старнице должны быть элементы с нужными id', () => {
      expect(loadingBlock).toBeInstanceOf(Element);
      expect(filterBlock).toBeInstanceOf(Element);
      expect(filterInput).toBeInstanceOf(Element);
      expect(filterResult).toBeInstanceOf(Element);
    });

      it('должен показываться список городов, соответствующих фильтру', (done) => {
      filterInput.value = 'fr';
      filterInput.dispatchEvent(new KeyboardEvent('input'));
      setTimeout(() => {
        expect(filterResult.children.length).toBe(3);
        done();
      }, 1200);
    }); // если timeout меньше или чуть больше 1200, то при индивидуальном запуске отрабатывает, при запуске сюита целиком - тест валится...

    it('результат должен быть пуст, если в поле пусто', (done) => {
      filterInput.value = '';
      filterInput.dispatchEvent(new KeyboardEvent('input'));
      setTimeout(() => {
        expect(filterResult.children.length).toBe(0);
        done();
      }, 1000);
    });
  });
});
