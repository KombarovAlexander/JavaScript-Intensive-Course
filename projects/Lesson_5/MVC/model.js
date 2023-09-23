// 1. Здесь реализован механизм исключительно для получения данных с сервиса VK, оперируем библиотекой vk-openapi
import VK from "vk-openapi"; // здесь требуется только модуль vk-openapi

export default {
  login(appId, perms) { // метод авторизации приложения в VK
    return new Promise((resolve, reject) => {
      VK.init({ // сначала инициация приложения с передачей appId
        apiId: appId
      });
      VK.Auth.login(response => { // авторизация
        if (response.session) {
          resolve(response);
        } else {
          reject(new Error("Не удалось авторизоваться"));
        }
      }, perms);
    });
  },
  callAPI(method, params) { // универсальная ф-ция (метод) вызов любого метода VK API
  params.v = params.v ||'5.131'; // передается версия API, если она передана в параметрах, либо 5.131, если не передана

  return new Promise((resolve, reject) => {
    VK.api(method, params, response => { // вызов метода VK API по имени (method) с передачей его параметров (params)
      if (response.error) {
        reject(new ErrorEvent(response.error.error_msg));
      } else {
        resolve(response.response);
      }
      });
    });
  },
  getUser(params = {}) { // здесь и далее - объявление 3-х методов для вызова одноименных методов VK API, чтобы не мучаться
                            // каждый раз с передачей имени метода при вызове callAPI()
    return this.callAPI('users.get', params); // получить пользователя под которым зашло наше приложение
  },
  getFriends(params = {}) {
    return this.callAPI('friends.get', params); // получить список друзей авторизовавшегося пользователя
  },
  getNews(params = {}) { // получить новости авторизовавшегося пользователя
    return this.callAPI('newsfeed.get', params);
  }
};
