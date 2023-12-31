// 4. Здесь реализован вызов метода контроллера в зависимости от того, какой путь (какую кнопку на табе нажали)
// был выбран в модуле точки входа (в нашем примере - это index.js)
// Т.е. это модуль управления "путями" нашего web-приложения
import Controller from './controller.js';
export default { // в зависимости от нажатой пользователем кнопки таба, оброботчик вызывает тот или иной метод контроллера
  handle(route) { // вызывает метод контроллера, который соответствует переданному имени
    const routeName = route + 'Route'; // собираем имя метода контролера как переданное имя + 'Route'
 //   console.log(routeName);
    Controller[routeName](); // в контроллере ищем имя метода по названию и вызываем его
  }
};

