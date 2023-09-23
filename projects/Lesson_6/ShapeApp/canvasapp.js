import './shapes';

export class CanvasApp { // класс, который будет взаимодействовать с канвой: очищать, отрисовывать фигуры и пр.
                         // мы его экспортируем, именованный экспорт
  constructor(canvas)
  { // передаем канву, на которой будем отрисовывать
    this.canvas = canvas; // наша текущая канва, на которой мы в данный момент будем рисовать
    this.frames = 0;
    this.fps = 0;
    this.lastFPSUpdate = 0;
    this.ctx = canvas.getContext('2d'); // установка контекста канвы - 2d, от него зависит набор методов, доступных для отрисовки
    this.shapes = []; // массив фигур, которые в данный момент отрисованы на канве
    this.render(); // сразу же, в конструкторе, запускаем метод отрисовки render() на нашей канве
  }

  render()
  { // отрисовка на канве; выполняется при каждом обновлении экрана (фрейма)
    requestAnimationFrame(() => {
      this.clear(); // чистим канву, чтобы не оставлять трек от передвигаемой нами в данный момент фигуры (если вдруг двигаем)
      for (let shape of this.shapes) { // по очереди отрисовываем все фигуры, содержащиеся на момент отрисовки кадра в массиве shapes[]
        this.renderShape(shape); // этот метод, собственно, и рисует фигуру
      }
      if (this.currentShape) { // если мы что-то в данный момент по канве таскаем, не "призамлили" еще фигуру, то надо перерисовать и ее
        this.renderShape(this.currentShape);
      }

      this.render(); // поскольку requestAnimationFrame() отрабатывает только 1 раз, мы зацикливаем вызов render(), чтобы
                     // он отрабатывал у нас постоянно, постоянно при обновлении кадра работал вызов render()
      this.renderFPS(); // отрисовка значений FPS
    }); // передаем и описываем нашу ф-цию, которую браузер будет выполнять при каждой отрисовке фрейма (кадра);
    // мы не определяем, когда эта прорисовка произойдет, это определяет браузер, но когда это происходит - отрабатывает наша
    // переданная callback-функция; анимация выполняется в специальном графическом потоке браузера и не накладывает дополнительную
    // нагрузку на DOM-дерево и его функционал
  }

  clear()
  { // чистим нашу канву (она у нас прямоугольная)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCanvas() { // получить контекст канвы
    return this.ctx;
  }

  renderShape(shape)
  {
    if (shape.canRender()) { // если фигуру можно отрисовать (ее координаты и размер не NaN/Infinity/-Infinity), то рисуем
      this.ctx.save(); // сохраняем состояние канвы
      this.ctx.translate(shape.x, shape.y); // меняем позицию точки начала координат
      shape.render(this.ctx); // вызываем метод отрисовки переданной фигуры
      this.ctx.restore(); // восстанавливаем прежнее состояние канвы
    }
  }
  addShape(shape) // добавляем фигуру в массив фигур, отрисованных на канве
  {
    if (shape && !this.shapes.includes(shape)) { // если фигура существует и она отсутствует в массиве shapes канвы CanvasApp, то..
      this.shapes.push(shape); // добавляем текущую фигуру в массив
    }
  }

  setCurrentShape(shape) // делаем фигуру текущей ("берем в руку")
  {
    this.currentShape = shape;
  }

  renderFPS() { // отрисовка на канве информации о FPS
    this.frames++;

    const now = performance.now();

    if (now - this.lastFPSUpdate >= 1000) {
      this.lastFPSUpdate = now;

      this.fps = this.frames;
      this.frames = 0;
    }
    this.ctx.save();
    this.ctx.font = "12px Helvetica";
    this.ctx.fillText(`${this.fps} FPS`, 10, 30);
    this.ctx.restore();
  }
}
