// 2. Здесь реализован механизм исключительно для отображения полученных ранее данных с сервиса VK, оперируем библиотекой handlebars
import './../index.html'; // требуется для работы с элементами разметки из док-та index.html
import Handlebars from 'handlebars/dist/handlebars'; // нужен для работы с шаблонами
import altfriendsTemplate from './../hbTempl/altfriends.hbs'; // подгружаем родительский шаблон, в которм ссылки еще на 2 дочерних

export default {
  render(templateName, model) { // метод получения фрагмента HTML с версткой по соответственному шаблону handlebars (templateName) и внедренными в эту разметку данными (model)
    let templateSource;
    let renderFunc;

    if (templateName === 'altfriends') {
      renderFunc = altfriendsTemplate;
    } else {
      templateName = templateName + 'Template'; // собираем имя шаблона, как переданное templateName + 'Template'
      let template = document.getElementById(templateName); // ищем в нашем HTML по id секцию <script>, из которой забираем соответствующий шаблон handlebars
      templateSource = template.innerHTML; // забрали сюда
      renderFunc = Handlebars.compile(templateSource); // функция, скомпилированная handlebars, для последующей
                                                       // передачи в нее данных (внедряет данные в шаблон handlebars)
    }

    console.log(renderFunc(model));
    return renderFunc(model); // возвращаем строку, состояющую из разметки сответствующего шаблона handlebars и внедренных
                              // в эту разметку данных (model)
  }
};
