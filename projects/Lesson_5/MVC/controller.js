// 3. Здесь реализована прослойка между Model и View: умеет обращаться к Model и получать данные,
// умеет обращаться к View и получать шаблон handlebars, предназначенный для отображения данных из Model
import './../index.html'; // требуется для работы с элементами разметки из док-та index.html
import Model from './model.js'; // т.к. controller работает и с Model, и с View, эти модули требуется подключить
import View from './view.js';
export default {
  async friendsRoute() { // метод получения данных и "отрисовка" карточек друзей
    const results = document.querySelector('#result'); // ищем в HTML-разметке по id блок, в который будем помещать карточки друзей
    const friends = await Model.getFriends({fields: 'photo_100'}); // получаем из Model список друзей; указываем, что помимо
                                                                         // стандартного набора полей ответа, хотим получить
                                                                         // еще и URL фото размером 100 px
    results.innerHTML = View.render('friends', {list: friends.items}); // вызываем из View метод render и
                                                                                        // передаем в него полученные из Model данные;
                                                                                        // в итоге получаем текстовую строку,
                                                                                        // содержащую HTML-разметку с внедренными
                                                                                        // в нее данными из Model, и вставляем эту
                                                                                        // разметку в блок #result
  },
  async altfriendsRoute() {
    const results = document.querySelector('#result');
    const friends = await Model.getFriends({fields: 'photo_100, bdate, country, city, education'});
    results.innerHTML = View.render('altfriends', {list: friends.items});
  },
  async newsRoute() { // метод получения данных и "отрисовка" новостей, механизм, аналогичный предыдущим
    const results = document.querySelector('#result');
    const news = await Model.getNews({filters: 'post', count: 20});
    results.innerHTML = View.render('news', {list: news.items});
  }
};
