import './scss/styles.scss';
import {API_URL, CDN_URL} from "./utils/constants";
import {WebLarekAPI} from "./components/WebLarekApi";
import {cloneTemplate, ensureElement} from './utils/utils';
import {Modal} from './components/common/Modal';
import {Basket, BasketProduct} from "./components/common/Basket";
import {Contact} from "./components/Contact"
import {Success} from "./components/common/Success"
import {EventEmitter} from './components/base/events';
import {IOrderForm, IProduct} from './types';
import {Page } from './components/Page';
import {Order} from './components/Order';
import {ProductCatalog} from './components/Catalog';
import {ProductViewDesc} from './components/ProductViewDesc';
import {AppState} from './components/AppData';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardModalTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contact(cloneTemplate(contactsTemplate), events);
const sucess = new Success(cloneTemplate(successTemplate), {onClick: () => {
    modal.close();
},});


// Модель данных приложения
const appData = new AppState({}, events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Получаем товар(карточчки) с сервера
api
	.getProductList()
	.then((items) => {
		appData.setCatalog(items as IProduct[]);
	})
	.catch(console.error);

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


// Выводим элементы каталога
events.on('catalog:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const product = new ProductCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return product.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});



// Открываем модалку и добавляем/удаляем товар из корзины 
events.on('card:select', (item: IProduct) => {
    const productInBasket = appData.productInBasket(item.id);
    const getButtonText = (inBasket: boolean): string => {
    return inBasket 
                ? 'Удалить из корзины' 
                : 'В корзину';
    };
	const product = new ProductViewDesc(cloneTemplate(previewCardModalTemplate), {
		onClick: () => {
            productInBasket 
                ? events.emit('product:deleteFromBasket', item)
                : events.emit('product:addToBasket', item);
                modal.close();
        },
        
	});
        return modal.render({
            content: product.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
            description: item.description,
            buttonText: getButtonText(productInBasket),})
        });
    });

events.on('basket:update', () => {
        basket.total = appData.getTotalSummBasket();
        basket.list = appData.basket.map((item, index) => {
        const basketProduct = new BasketProduct(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('product:deleteFromBasket', item);
            },
        });
    
        return basketProduct.render({
            title: item.title,
            price: item.price,
            index: index + 1,
        } as BasketProduct);
    }); 
});

    // Обновляем счетчик
events.on('сounter:update', () => {
    const count = appData.getBasketItemCount(); // Получаем количество товаров в корзине
    page.counter = count; // Обновляем счетчик на странице
});
    
    // Обработчики событий для добавления и удаления товара из корзины
events.on('product:addToBasket', (item: IProduct) => {
    appData.handleProductAction('add', item);
    events.emit('basket:update'); // Обновляем корзину после добавления
    events.emit('сounter:update'); // Обновляем счетчик
});

events.on('product:deleteFromBasket', (item: IProduct) => {
    appData.handleProductAction('delete', item);
    events.emit('basket:update'); // Обновляем корзину после удаления
    events.emit('сounter:update'); // Обновляем счетчик
});
    
    //Открываем корзину
events.on('basket:open', () => { 
    modal.render({
        content: basket.render(),
        });
    });
    
    //Открываем модалку заказа payment/address
    events.on('order:open', () => {
            modal.render({
                content: order.render({
                    payment: appData.orderDetails.payment,
                    address: appData.orderDetails.address,
                    valid: appData.validateOrderPay(),
                    errors: [],
                }),
            });
    });

   // Изменилось состояние валидации формы
events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

   // Обработчик события изменения ввода
   events.on('input:change', ({ field, value }: { field: keyof IOrderForm; value: string }) => {
    console.log(`Изменено поле: ${field}, новое значение: ${value}`);
    appData.setOrderField(field, value);
});

  //Открываем модалку заказа phone/email
events.on('order:submit', () => {
    modal.render({
        content: contact.render({
            email: appData.orderDetails.email,
			phone: appData.orderDetails.phone,
            valid: appData.validateOrderContact(),
            errors: []
        })
    });
});

   // Изменилось состояние валидации формы
events.on('contactOrderErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', async () => {
    try {
        const total = appData.getTotalSummBasket();
        const items = appData.getBasketProductIDs();

        const res = await api.orderProducts(appData.orderDetails, total, items);

        // Очищаем корзину и детали заказа после успешного заказа
        appData.clearOrder();
        appData.basket = [];
        events.emit('basket:update');
        events.emit('сounter:update');
        //Показываем модалку успешного заказа
        modal.render({
            content: sucess.render({
                total: res.total
            }),
        });
    } catch (err) {
        console.error(err);
    }
});