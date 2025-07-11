# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара в приложении
```
interface IProduct {
  id: string;
   image: string;
   title: string;
   category: string;
   price: number | null;
   description: string;
   buttonText?: string;
}
```

Содержание главной страницы
```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

Описание товара в корзине
```
interface IBasketView {
	title: string;
    total: number;
    index: string;
}
```

Данные данных покупателя при заказе
```
interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}
```

Прверка валидности формы при заполнении
```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Отображение общей суммы заказа 
```
interface IOrderResult {
	id: string;
	total: number;
}
```

Успешное выполнение заказа
```
interface ISuccess {
    total: number;
}
```

Отображение для всех модалок 
```
interface IModalData {
    content: HTMLElement;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой данных, отвечает за хранение и изменение данных
- слой представления, отвечает за отображение данных на странице,
- презентер, отвечает за связь представления и данных.


### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

**Методы**:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

**Методы**, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Абстрактный класс Component

Самый главный класс для всех элементов представления.

**Методы**:
- `setText` - метод устанавливает текстовое содержимое
- `setDisable` - метод статуса блокировки
- `setHiden` - метод скрывает элемент
- `setVisible` - метод показывает элемент
- `setImage` - метод устанавливает изображение
- `render` - метод возвращает элемент разметки, для отображнения на странице

#### Абстрактный класс Model

Kласс модели данных
Содержит метод `emitChanges`, который создаёт уникальное событие


### Слой данных

#### Класс WebStoreApi

Этот класс предоставляет интерфейс для взаимодействия с API приложения.
**Методы**:
- `getProductsList()` — получает список всех доступных продуктов в виде массива объектов.
- `getProductItem: (id: string)` — получает карточку и всю информацию о ней по id.
- `orderProducts()` — Отправляет данные по заказу на сервер (данные пользователя, итоговая сумма заказа, товар) и возвращает результат операции.

#### Класс AppState

Клас хранит информацию приложения: данные о каталоге, данные заказа, корзины, и также описывается логика работы с этими данными.
**Поля класса:**
- `basket: IProduct[] = [];` - Массив продуктов, добавленных в корзину.
- `catalog: IProduct[] = [];` - Массив доступных продуктов в каталоге.
- `orderDetails: IOrderForm` - Объект, содержащий детали заказа, такие как адрес, способ оплаты, email и телефон.
- `preview: string | null`- Идентификатор продукта, выбранного для предварительного просмотра.
- `formErrors: FormErrors`- Объект, содержащий ошибки валидации формы.

**Методы**:
- `setCatalog(items: IProduct[])` - устанавливает каталог товаров.
- `setPreview(item: IProduct): void` - метод устанавливает продукт для предварительного просмотра.
- `setOrderField(field: keyof IOrderForm, value: string): void` - устанавливает значение для поля заказа и проверяет валидность данных. Если данные валидны, он вызывает соответствующие события.
- `validateOrderPay(): boolean` - проверяет валидность полей оплаты и адреса.
- `validateOrderContact(): boolean` - проверяет валидность полей email и телефона.
- `clearOrder()` - метод очищает детали заказа.
- `getBasketItemCount(): number` - возвращает количество продуктов в корзине для счетчика.
- `getTotalSummBasket(): number` - возвращает общую сумму всех товаров в корзине.
- `getBasketProductIDs(): string[]` - устанавливает массив id товаров в корзине.
- `addProductToBasket(product: IProduct): void` - добавляет товар в корзину.
- `removeProductFromBasket(item: IProduct): void` - удаляет товр из корзины.
- `productInBasket(id: string): boolean` - определяет по id, находится ли товар в корзине.
-`handleProductAction` - обрабатывает действие добавления или удаления продукта из корзины.


### Слой отображения

#### Класс Product

Класс, который представляет продукт в пользовательском интерфейсе. Он предоставляет методы для управления отображением информации о продукте, такой как название, цена и кнопка действия.

**Поля класса:**
- `_id: HTMLElement` - элемент, представляющий идентификатор продукта.
- `_title: HTMLElement` - элемент, представляющий название продукта.
- `_price: HTMLElement` - элемент, представляющий цену продукта.
- `_button?: HTMLButtonElement` - кнопка действия, связанная с продуктом (опционально).

**Конструктор**
`constructor(container: HTMLElement, actions?: IProductActions)`

Конструктор класса принимает следующие параметры:

- `container` - HTML-элемент, в котором будет отображаться информация о продукте.
- `actions` - объект, содержащий действия, которые могут быть выполнены с продуктом (например, обработчик клика).

**Пример использования:**
```typescript
const productCard = new Product(containerElement, {
    onClick: () => {
        console.log('Product clicked!');
    }
});
```

**Методы:**
- `get/set id/title` - геттеры и сеттеры id и названия товара, которые возвращают и устанавливают эти данные о товаре.
- `set price(value: number | null): void` - устанавливает цену продукта. Если цена равна null, отображается сообщение "Бесценно", и кнопка действия отключается. В противном случае цена отображается с добавлением текста "синапсов".
-`set buttonText(value: string): void` - устанавливает текст кнопки покупки товара в карточке.


#### Класс Page

Класс, который представляет страницу в пользовательском интерфейсе. Он отображет каталог товаров, всю главную страницу.

**Поля класса:**
- `_counter: HTMLElement` - элемент, представляющий счетчик товаров в корзине.
- `_catalog: HTMLElement` - элемент, представляющий каталог товаров.
- `_wrapper: HTMLElement` - обертка для содержимого страницы.
- `_basket: HTMLButtonElement` - кнопка для открытия корзины.
- `_locked: boolean` - состояние блокировки страницы.

**Методы:**
- `set counter(value: number): void` - устанавливает текст счетчика товаров в корзине.
- `set catalog(items: HTMLElement[]): void` - обновляет содержимое каталога товаров
- `set locked(value: boolean): void` - устанавливает состояние блокировки/разблокировки страницы.


#### Класс ProductCatalog

Класс, который расширяет функциональность класса `Product`, добавляя поддержку изображений и категорий товаров. Он предназначен для отображения информации о товаре в каталоге, включая его изображение и категорию.

**Поля класса:**
- `_image: HTMLImageElement` - элемент, представляющий изображение товара.
- `_category: HTMLElement` - элемент, представляющий категорию товара.
- `_categoryColor: Map<string, string>` - категории с соответствующими классами для стилизации.

**Методы:**
- `set category(value: string): void` - устанавливает категорию товара, обновляя текстовое содержимое элемента _category и добавляя соответствующий класс для стилизации.
- `set image(value: string): void` - устанавливает изображение товара, обновляя элемент _image с помощью заданного URL и заголовка товара.

#### Класс ProductViewDesc

Класс, который дополнительно добавляет описание товара.

**Поля класса:**
`_description: HTMLElement` - элемент, представляющий описание товара.

**Методы:**
- `set description(value: string | string[]): void` - устанавливает описание продукта. Может принимать строку и массив строк.


#### Класс Order

Класс, который представляет форму заказа в пользовательском интерфейсе. Предоставляет методы для управления элементами формы, такими как кнопки оплаты и поле ввода адреса.

**Поля класса:**
- `_paymentCashButton: HTMLButtonElement` - кнопка для выбора оплаты наличными.
- `_paymentCardButton: HTMLButtonElement` - кнопка для выбора оплаты картой.
- `_addressInput: HTMLInputElement` - поле ввода для адреса доставки.

**Методы:**
- `setupPaymentButtonListeners(): void` - устанавливает обработчики событий для кнопок оплаты. Он добавляет обработчики клика для кнопок "Оплата наличными" и "Оплата картой", устанавливая соответствующий метод оплаты и вызывая событие изменения ввода.
- `setPaymentMethod(method: 'cash' | 'card'): void` - устанавливает выбранный метод оплаты и обновляет классы кнопок для визуального отображения активного метода.
- `set address(value: string): void` - устанавливает значение для поля ввода адреса.


#### Класс Contact

Класс, который представляет форму для ввода контактной информации в пользовательском интерфейсе. Предоставляет методы для управления элементами формы, такими как поля ввода номера телефона и электронной почты.

**Поля класса:**
- `_inputPhoneNumber: HTMLInputElement` - поле ввода для номера телефона.
- `_inputEmail: HTMLInputElement` - поле ввода для электронной почты.

**Методы:**
- `set phone(value: string): void` - устанавливает значение для поля ввода номера телефона.
- `set email(value: string): void` - устанавливает значение для поля ввода электронной почты.


#### Класс Success

Класс, который представляет компонент успешного завершения заказа в пользовательском интерфейсе. Предоставляет методы для управления элементами, связанными с успешным завершением заказа, такими как кнопка закрытия и отображение общей суммы.

**Поля класса:**
- `_close: HTMLElement` - элемент, представляющий кнопку закрытия сообщения об успешном заказе.
- `_total: HTMLElement` - элемент, представляющий описание общей суммы, списанной с пользователя.

**Методы:**
- `set total(value: string): void` - устанавливает общую сумму, списанную с пользователя.


#### Класс Form
Обобщенный класс, который представляет форму в пользовательском интерфейсе. Он предоставляет методы для управления элементами формы, обработки ввода и валидации.

**Поля класса:**
- `_submit: HTMLButtonElement` - кнопка отправки формы.
- `_errors: HTMLElement` - элемент, отображающий ошибки валидации формы.
- `container: HTMLFormElement` - HTML-элемент формы.
- `events: IEvents` - объект, реализующий интерфейс событий, который используется для обработки событий на форме.

**Методы:**
- `onInputChange(field: keyof T, value: string): void` - обрабатывает изменения ввода в полях формы и генерирует событие изменения для соответствующего поля.
- `set valid(value: boolean): void` - устанавливает состояние кнопки отправки формы (активна или неактивна) в зависимости от переданного значения.
- `set errors(value: string): void` - устанавливает текстовое содержимое ошибки валидации формы и отображает ее.
- `render(state: Partial<T> & IFormState): HTMLFormElement` - обновляет состояние формы, включая валидацию и ошибки.


#### Класс Basket
Класс, который представляет корзину покупок в пользовательском интерфейсе. Предоставляет методы для управления элементами корзины, отображения списка товаров, общей суммы и обработки событий.

**Поля класса:**
- `_list: HTMLElement` - элемент, представляющий список товаров в корзине.
- `_total: HTMLElement` - элемент, отображающий общую сумму товаров в корзине.
- `_button: HTMLButtonElement` - кнопка для оформления заказа.
- `events: IEvents` - объект, реализующий интерфейс событий, который используется для обработки событий на корзине.

**Методы:**
- `set list(items: HTMLElement[]): void` - устанавливает список товаров в корзине. Если список не пуст, он заменяет содержимое элемента _list на новые элементы и разблокирует кнопку оформления заказа. Если список пуст, он отображает сообщение "Корзина пуста" и блокирует кнопку.
- `set total(total: number): void` - отображает общую сумму товаров в корзине.


#### Класс BasketProduct
Класс, который добавляет функциональность для отображения индекса товара в корзине и управления кнопкой удаления.

**Поля класса:**
- `_index: HTMLElement` - элемент, представляющий индекс товара в корзине.
- `_button: HTMLButtonElement` - кнопка для удаления товара из корзины.

**Методы:**
- `set index(value: number): void` - устанавливает индекс товара.

### Презентер

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*
- `catalog:changed` - изменения состояния каталога. Обновляет каталог товаров.
- `preview:open` - 
- `orderErrors:change` - обработчик для изменения ошибок при оформлении заказа. Проверяет наличие ошибок и обновляет валидность формы заказа.
- `contactOrderErrors:change` - обработчик для изменения ошибок при оформлении контактных данных заказа. Проверяет наличие ошибок и обновляет валидность формы контактных данных.
- `basket:updated` - обновляет количество товаров в корзине.
- `modal:open` - открывает модальное окно и блокирует прокрутку страницы.
- `modal:close` - закрывает модальное окно и разблокирует прокрутку страницы.
- `card:select` - открывает модальное окно с описанием товара, когда карточка товара выбирается.
- `сounter:update` - обновляет счетчик товаров на странице.
- `product:addToBasket` - добавляет товар в корзину и обновляет состояние корзины и счетчика.
- `product:deleteFromBasket` - удаляет товар из корзины и обновляет состояние корзины и счетчика.
- `basket:open` - открывает корзину в модальном окне.
- `order:open` - открывает модальное окно для оформления заказа, отображая детали заказа.
- `input:change` - обрабатывает изменения ввода в полях формы и обновляет состояние заказа.
- `order:submit` - открывает модальное окно для ввода контактной информации (email/phone) при оформлении заказа.
- `contacts:submit` - обрабатывает отправку контактной информации и выполняет заказ, очищая корзину и показывая модальное окно с успешным заказом.




