import {
  randomNumberArray,
  randomStringArray,
  randomValue as random,
} from '../../scripts/helper';
import {
  createProxy,
  forEach,
  map,
  reduce,
  upperProps,
  isAllTrue,
  isSomeTrue,
  selfCallBack,
  createObj,
} from './index';

describe('ДЗ 2, часть 1 - объекты и массивы', () => {
  describe('forEach', () => {
    it('должна вызывать функцию для каждого элемента массива', () => {
      const array = randomNumberArray();
      const fn = jest.fn();

      forEach(fn, array);

      for (let i = 0; i < array.length; i++) {
        expect(fn).nthCalledWith(i + 1, array[i], i, array);
      }
    });
  });

  describe('map', () => {
    it('должна вызывать функцию для каждого элемента массива и не изменять оригинальный массив', () => {
      const originalArray = randomNumberArray();
      const array = [...originalArray];
      const modified = array.map((el) => el ** 2);
      const fn = jest.fn((el) => el ** 2);

      expect(map(fn, array)).toEqual(modified);
      expect(array).toEqual(originalArray);

      for (let i = 0; i < array.length; i++) {
        expect(fn).nthCalledWith(i + 1, array[i], i, array);
      }
    });
  });

  describe('reduce', () => {
    it('должна вызывать функцию для каждого элемента и передавать предыдущий результат первым аргументом', () => {
      const originalArray = randomNumberArray(); // Случайный массив (эталонный)
      const array = [...originalArray]; // в исследуемый массив копируем случайный (эталонный)
      const modified = array.reduce((all, current) => all + current); // Создаем новый массив, в который возвращаем результат вызова
      // стандартного метода массива reduce
      const fn = jest.fn((all, current) => all + current); // В функцию-заглушку jest.fn() пишем такую же суммирующую функцию,
      //что и для modified = array.reduce()

      expect(reduce(fn, array)).toEqual(modified); // Ожидаем, что массив, выданный в результате работы нашей reduce, будет эквивалентен
      // массиву, полученному в результате работы стандартного метода массива reduce
      expect(array).toEqual(originalArray); // Ожидаем, что входящий массив, переданный в нашу функцию reduce, не подвергся модификации
      // (т.е. после вызова reduce входящий массив остался равен эталонному)

      let sum = array[0]; // не учитываем initial

      for (let i = 1; i < array.length; i++) {
        expect(fn).nthCalledWith(i, sum, array[i], i, array);
        sum += array[i];
      }
    });

    it('должна учитывать initial', () => {
      const originalArray = randomNumberArray();
      const array = [...originalArray];
      const modified = array.reduce((all, current) => all + current, 10); // Передаем initial = 10
      const fn = jest.fn((all, current) => all + current);

      expect(reduce(fn, array, 10)).toEqual(modified); // Передаем initial = 10
      expect(array).toEqual(originalArray);

      let sum = 10;

      for (let i = 0; i < array.length; i++) {
        expect(fn).nthCalledWith(i + 1, sum, array[i], i, array);
        sum += array[i];
      }
    });
  });

  describe('upperProps', () => {
    it('должна возвращать массив с именами свойств и преобразовывать эти имена в верхний регистр', () => {
      const obj = { a: 1, b: 2 };
      const target = ['A', 'B'];
      const result = upperProps(obj);

      expect(result).toEqual(target);
    });
  });

  describe('createProxy', () => {
    it('должна вернуть Proxy, который возводит в квадрат любое записываемое значение', () => {
      let obj = {};

      obj = createProxy(obj);

      obj.a = 2;
      obj.b = 5;

      expect(obj).toEqual({ a: 4, b: 25 });
    });
  });
});

///////////// ЧАСТЬ 2 /////////////
describe('ДЗ 2, часть 2 - работа с исключениями и отладчиком', () => {
  describe('isAllTrue', () => {
    it('должна вызывать fn для всех элементов массива', () => {
      const array = random('array', 1);
      const pass = [];

      isAllTrue((e) => pass.push(e), array);

      expect(pass).toEqual(array);
    });

    it('должна вернуть true, если fn вернула true для всех элементов массива', () => {
      const array = randomNumberArray();
      const result = isAllTrue(Number.isFinite, array);

      expect(result);
    });

    it('должна вернуть false, если fn вернула false хотя бы для одного элемента массива', () => {
      const array = randomNumberArray();

      array.push(random('string'));
      const result = isAllTrue(Number.isFinite, array);

      expect(!result);
    });

    it('должна выбросить исключение, если передан пустой массив', () => {
      expect(() => isAllTrue([], () => {})).toThrow('empty array');
    });

    it('должна выбросить исключение, если передан не массив', () => {
      expect(() => isAllTrue(':(', () => {})).toThrow('empty array');
      expect(() => isAllTrue({}, () => {})).toThrow('empty array');
    });

    it('должна выбросить исключение, если fn не функция', () => {
      const array = randomNumberArray();

      expect(() => isAllTrue(':(', array)).toThrow('callbackFn is not a function');
    });
  });

  describe('isSomeTrue', () => {
    it('должна вернуть true, если fn вернула true хотя бы для одного элемента массива', () => {
      const array = randomStringArray().concat(random('number'));
      const result = isSomeTrue(Number.isFinite, array);

      expect(result);
    });

    it('должна вернуть false, если fn не вернула true хотя бы для одного элемента массива', () => {
      const array = randomStringArray();
      const result = isSomeTrue(Number.isFinite, array);

      expect(!result);
    });

    it('должна выбросить исключение, если передан пустой массив', () => {
      expect(() => isSomeTrue([], () => {})).toThrow('empty array');
    });

    it('должна выбросить исключение, если передан не массив', () => {
      expect(() => isSomeTrue(':(', () => {})).toThrow('empty array');
      expect(() => isSomeTrue({}, () => {})).toThrow('empty array');
    });

    it('должна выбросить исключение, если fn не функция', () => {
      const array = randomNumberArray();

      expect(() => isSomeTrue(':(', array)).toThrow('callbackFn is not a function');
    });
  });

  describe('returnBadArguments', () => {
    it('должна вызывать fn для всех элементов массива', () => {
      const array = random('array', 1);
      const pass = [];

      selfCallBack((e) => pass.push(e), ...array);

      expect(pass).toEqual(array);
    });

    it('должна вернуть массив с аргументами, для которых fn выбросила исключение', () => {
      const evenNumbers = randomNumberArray('even');
      const oddNumbers = randomNumberArray('odd');
      const fn = (a) => {
        if (a % 2 !== 0) {
          throw new Error('not even');
        }
      };

      const result = selfCallBack(fn, ...evenNumbers, ...oddNumbers);

      expect(result).toEqual(oddNumbers);
    });

    it('должна вернуть массив пустой массив, если не передано дополнительных аргументов', () => {
      const fn = () => ':)';
      const result = selfCallBack(fn);

      expect(result.length).toBe(0);
    });

    it('должна выбросить исключение, если fn не функция', () => {
      expect(() => selfCallBack(':(')).toThrow('selfCallBack error: fn (args[0]) is not a function');
    });
  });

  describe('createObj', () => {
    it('должна возвращать объект с методами', () => {
      const calc = createObj();

      expect(Object.keys(calc)).toEqual(['number', 'sum', 'dif', 'div', 'mul']);
    });

    it('метод sum должен складывать аргументы', () => {
      const initialValue = random('number');
      const calc = createObj(initialValue);
      const args = randomNumberArray();

      expect(calc.sum(...args)).toBe(
        args.reduce((prev, current) => prev + current, initialValue)
      );
    });

    it('метод dif должен вычитать аргументы', () => {
      const initialValue = random('number');
      const calc = createObj(initialValue);
      const args = randomNumberArray();

      expect(calc.dif(...args)).toBe(
        args.reduce((prev, current) => prev - current, initialValue)
      );
    });

    it('метод div должен делить аргументы', () => {
      const initialValue = random('number');
      const calc = createObj(initialValue);
      const args = randomNumberArray();

      expect(calc.div(...args)).toBe(
        args.reduce((prev, current) => prev / current, initialValue)
      );
    });

    it('метод div должен выбрасывать исключение, если хотя бы один из аргументов равен 0', () => {
      const initialValue = random('number');
      const calc = createObj(initialValue);
      const args = [...randomNumberArray(), 0];

      expect(() => calc.div(...args)).toThrow('division by 0');
    });

    it('метод mul должен умножать аргументы', () => {
      const initialValue = random('number');
      const calc = createObj(initialValue);
      const args = randomNumberArray();

      expect(calc.mul(...args)).toBe(
        args.reduce((prev, current) => prev * current, initialValue)
      );
    });

    it('функция должна выбрасывать исключение, если number не является числом', () => {
      expect(() => createObj(':(')).toThrow('number is not a number');
    });

    it('значение по умолчанию для аргумента number должно быть равно 0', () => {
      const calc = createObj();
      const args = randomNumberArray();

      expect(calc.sum(...args)).toBe(args.reduce((prev, current) => prev + current));
    });
  });
});
