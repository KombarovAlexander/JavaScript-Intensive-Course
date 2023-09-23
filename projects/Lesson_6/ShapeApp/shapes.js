// здесь классы экспортируются по отдельности, но импортировать мы их будем все целиком, через *
export class Shape {
  constructor(x, y, size) { // конструктор фигуры
    this.setPosition(x, y); // инициализируем поля координат, размера фигуры и пути отрисовки фигуры (path2D)
    this.setSize(size);
    this.path2D = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(size) {
    this.size = size < 0 ? 0 : size; // если размер <0 то 0, иначе размер
  }

  setStrokeColor(color) {
    this.StrokeColor = color;
  }

  setFillColor(color) {
    this.fillColor = color;
  }

  setStrokeWidth(width) {
    this.StrokeWidth = width;
  }

  canRender() { // метод, определяющий, что фигуру можно в принципе отрисовать
    return (
      Number.isFinite(this.size) && // если координаты и размер не NaN/Infinity/-Infinity, то true и фигуру можно отрисовывать
      Number.isFinite(this.x) &&
      Number.isFinite(this.y)
    );
  }

  isPointInShape(ctx, x, y) { // принадлежит ли точка фигуре или нет
    return ctx.isPointInPath(this.path2D, x, y);
  }

  render(ctx) { // абстрактный метод, предполагает реализацию в потомках
    throw new Error("Это метод отрисовки абстрактной фигуры. Отрисовка абстрактной фигуры невозможна.");
  }
}

export class Circle extends Shape { // далее - классы потомков, которые реализуют один-единственый метод render для отрисовки
                                   // геометрии своей фигуры

  render(ctx) {
    let circle = new Path2D();
    ctx.beginPath();
    circle.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);
    circle.closePath();
    this.path2D = circle;
   // console.log(circle.toLocaleString());
   // console.log(`Точка [${this.x + 10}, ${this.y + 10}] принадлежит фигуре ? - ${ctx.isPointInPath(this.path2D, this.x + 10, this.y + 10, "evenodd")}`);

    ctx.fillStyle = this.fillColor;
    ctx.fill(circle);
    ctx.lineWidth = this.StrokeWidth;
    ctx.strokeStyle = this.StrokeColor;
    ctx.stroke(circle);
  }
}

export class Quad extends Shape {
  render(ctx) {
    ctx.beginPath();

    ctx.rect(
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    );

    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.lineWidth = this.StrokeWidth;
    ctx.strokeStyle = this.StrokeColor;
    ctx.stroke();
  }
}

export class Triangle extends Shape {
  render(ctx) {
    ctx.beginPath();

    ctx.moveTo(0, -this.size / 2);
    ctx.lineTo(this.size / 2, this.size / 2);
    ctx.lineTo(-this.size / 2, this.size / 2);
    ctx.closePath();

    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.lineWidth = this.StrokeWidth;
    ctx.strokeStyle = this.StrokeColor;
    ctx.stroke();
  }
}

