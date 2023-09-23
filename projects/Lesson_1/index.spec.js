import { randomStringArray, randomValue as random } from '../../scripts/helper.mjs'; // хелпер для генерации рандомных значений
import {
  returnFirstArgument,
  sumWithDefaults,
  returnFnResult,
  returnCounter,
  returnArgumentsArray,
  bindFunction,
} from './index.mjs'; // импорт тестируемых функций из модуля index.mjs

describe('Домашнее задание. Неделя 1. Функции', () => {
  describe('returnFirstArgument', () => {
    it('должна возвращать переданный аргумент', () => {
      const value = random();
      const result = returnFirstArgument(value);

      expect(result).toBe(value);
    });
  });

  describe('sumWithDefaults', () => {
    it('должна возвращать сумму переданных аргументов', () => {
      const valueA = random('number');
      const valueB = random('number');
      const result = sumWithDefaults(valueA, valueB);

      expect(result).toBe(valueA + valueB);
    });

    it('значение по умолчанию второго аргумента должно быть 100', () => {
      const value = random('number');
      const result = sumWithDefaults(value);

      expect(result).toBe(value + 100);
    });
  });

  describe('returnFnResult', () => {
    it('должна возвращать результат вызова переданной функции', () => {
      let concatFn = word => word + ' слово 2';

      const value = random();
      const value1 = value + ' слово 2';
      const result = returnFnResult(value, concatFn);

      expect(result).toBe(value1);
    });
  });

  describe('returnCounter', () => {
    it('должна возвращать функцию', () => {
      const result = returnCounter();

      expect(typeof result).toBe('function');
    });

    it('возвращаемая функция должна увеличивать переданное число на единицу при каждом вызове', () => {
      const value = random('number');
      const result = returnCounter(value);

      expect(result()).toBe(value + 1);
      expect(result()).toBe(value + 2);
      expect(result()).toBe(value + 3);
    });

    it('значение аргумента должно быть 0 по умолчанию', () => {
      const result = returnCounter();

      expect(result()).toBe(1);
      expect(result()).toBe(2);
      expect(result()).toBe(3);
    });
  });

  describe('returnArgumentsArray', () => {
    it('должна возвращать переданные аргументы в виде массива', () => {
      const value = random('array', 1);
      const result = returnArgumentsArray(...value);

      expect(result).toEqual(value);
    });

    it('должна возвращать пустой массив если нет аргументов', () => {
      const result = returnArgumentsArray();

      expect(result.length).toBe(0);
    });
  });

  describe('bindFunction', () => {
    const valuesArr = randomStringArray();

    const sumThree = (a = 0, b = 0, c = 0) => a + b + c;

    it('должна возвращать функцию', () => {
      const result = bindFunction(sumThree);

      expect(typeof result).toBe('function');
    });

    it('должна привязывать любое кол-во аргументов возвращаемой функции', () => {
      const result = bindFunction(sumThree, ...valuesArr);

      expect(result()).toBe(sumThree(...valuesArr)); // Т.е. массив, прогнанный через функцию bindFunctionThree,
                                                    // должен быть таким же, как и массив, прогнанный через
                                                    // sumThree напрямую.
    });
  });
});
