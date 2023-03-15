# Карта с аптеками

index.html -- карта, строка поиска
app.js -- инициализация карты и строки поиска
style.css -- стили

libs -- библиотеки и стили leaflet
img -- иконки

входные данные: 
* аптеки -- сейчас подключаются в index.html как файл pharm.js
* center -- начало карты, сейчас написано в самом начале app.js

# Библиотеки

Все библиотеки хороши. 

Но сейчас geosearch.css и leaflet-geosearch.js совсем не обязательны. Они понадобятся, если нужно будет переключить автокомплит.

# GoogleAPI:

Подключается в index.html следующим образом
```
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR\_API\_KEY&region=YOUR\_REGION&language=YOUR\_LANGUAGE&libraries=places"></script> 
```
Впишите нужные: YOUR\_API\_KEY, YOUR\_REGION, YOUR\_LANGUAGE


# Как настроить апи

* Создать проект в Google Clouds: https://developers.google.com/maps/documentation/javascript/cloud-setup 
* Привязать к нему карту
* Получить API-key: Credential->Projects->YOUR_PROJECT->Create Credential->API Key->
* Настроить ограничения по сайту: Key->Edit API Key->Set an application restriction->Website->YOURWEBSITE
* Настроить ограничения по API: API RESTRICTION ->Rescrict Key-> Geocoding API & Maps JavaScript API
* Используйте ключ в работе: поставьте в index.html в подключении к гугл-апи и в app.js в GoogleProvider

# ToDo:

* Проверить мобилку
* Если гугл мапс отваливается, надо подклаывать OSM
* Автокомплит не масштабирует
* Вообще у меня автокомплит оставил ощущение масштабного костыля. Как будто есть правильное использование гугловского API (или готовые решения), но они не были найдены