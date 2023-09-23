import './index.html';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CanvasApp} from './ShapeApp/canvasapp.js'; // импортируем класс CanvasApp (именованный импорт)
import * as classShapes from './ShapeApp/shapes.js'; // импортируем все классы фигур (доступны через обращение classShapes.<ИмяКласса>)

const parentContainer = document.querySelector('.container');
const myCanvas = document.querySelector('#myCanvas');
const app = new CanvasApp(myCanvas); // создаем экземпляр класса CanvasApp для нашего DOM-элемента канвы myCanvas
const shapeMap = { // карта соответствий, которая сопоставляет содержимое атрибутов data-shape из разметки с названиями классов фигур
  circle: classShapes.Circle,
  quad: classShapes.Quad,
  triangle: classShapes.Triangle,
};

let currentFillColor = "#fff";
let currentStrokeColor = "#9D8CD7";
let currentStrokeWidth = 3;
let currentSize = 100;

myCanvas.width = parentContainer.clientWidth; // размеры канвы подгоняем под размеры родительского контейнера, без этого
                                              // картинка "пикселезируется"
myCanvas.height = parentContainer.clientHeight;

window.addEventListener('load', onResize); // ресайзим контейнер канвы
window.addEventListener('resize', onResize);
document.addEventListener('click', event => { // при клике на документе пытаемся считать у источника события target
                                                        // атрибут data-shape из dataset и...
  const {shape} = event.target.dataset; // записать его значение в переменную shape

  if (shape && shapeMap.hasOwnProperty(shape)) { // если в shape что-то есть и в нашей карте соответствий имеется ключ с таким значением
    const shapeClass = shapeMap[shape]; // забираем из карты соответствий значение (название класса фигуры) ключа shape
    const newShape = createShape(shapeClass, event.clientX, event.clientY); // создаем новую фигуру найденного класса
    app.setCurrentShape(newShape); // и делаем ее текущей ("берем в руку")
  }
});
document.addEventListener('keydown', event => { // обработчик события нажатия кнопки (на документе)
  if (event.key === 'Escape') { // если нажали ESC, то очищаем текущую фигуру ("убираем ее из руки")
    app.setCurrentShape(null);
  }
});
myCanvas.addEventListener('click', event => { // обработчик клика на канве
  if (app.currentShape) { // если имеется текущая фигура ("таскаем что-то в руках"), то..
    const shapeClass = app.currentShape.constructor; // выясняем, каким конструктором создана данная фигура (выясняем класс)
    const shape = createShape(shapeClass, event.clientX, event.clientY); // создаем фигуру выясненного класса и в текущей координате

    app.addShape(app.currentShape); // старую текущую фигуру добавляем в массив фигур канвы
    app.setCurrentShape(shape); // новой текущей фигурой делаем только что созданную и таскаем дальше ее
  } else {
    app.shapes.forEach((shape, idx) => { // попытка выяснить, на какой именно фигуре был осуществлен клик
      let x = (event.clientX-myCanvas.getBoundingClientRect().left)*(myCanvas.width/myCanvas.getBoundingClientRect().width);
      let y = (event.clientY-myCanvas.getBoundingClientRect().top)*(myCanvas.height/myCanvas.getBoundingClientRect().height);
      console.log(x, y);
      console.log(shape.isPointInShape(app.getCanvas(), x, y));

    });
  }
});
myCanvas.addEventListener('mousemove', event => { // обработчик движения мыши
  app.currentShape?.setPosition(event.clientX, event.clientY); // если текущая фигура есть, то меняем ее координаты на переданные
});
myCanvas.addEventListener('wheel', event => { // обработчик прокрутки колеса мыши
  event.preventDefault(); // запрещаем действие по умолчанию, чтобы браузер не скролил страницу
  if (app.currentShape) { // если текущая фигура есть, то ..
    currentSize = app.currentShape.size + event.deltaY / 10; // считаем новый размер текущей фигуры (event.deltaY / 10, шаг ресайза 1/10)
    app.currentShape.setSize(currentSize); // устанавливаем новый размер текущей фигуры
  }
});

function onResize() { // при ресайзе...
  parentContainer.Width = window.innerWidth; // ресайзим контейнер канвы при ресайзе окна браузера
  parentContainer.Height = window.innerHeight;
  //myCanvas.width = window.innerWidth;
  //myCanvas.height = window.innerHeight;
}
function createShape(ShapeClass, x, y) { // создаем фигуру...
  const shape = new ShapeClass(x, y, currentSize); // создаем экземпляр фигуры указанного класса с указанными размерами и координатами

  shape.setFillColor(currentFillColor); // устанавливаем цвет заливки
  shape.setStrokeColor(currentStrokeColor); // устанавливаем цвет контура
  shape.setStrokeWidth(currentStrokeWidth); // устанавливаем толщину линии контура

  return shape; // возвращаем созданную фигуру
}
