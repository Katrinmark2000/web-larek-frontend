import { Model } from './base/Model';
import { FormErrors, IAppState, IProduct, IOrderForm } from '../types';

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[] = [];
	orderDetails: IOrderForm = {
		address: '',
		payment: '',
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed');
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:open', item);
	}


	setOrderField(field: keyof IOrderForm, value: string) {
		this.orderDetails[field] = value;

		// Сначала проверяем валидность заказа
		if (this.validateOrderPay()) {
			this.events.emit('PaymentAdress:ready', this.orderDetails);
		}
	
		// Затем проверяем валидность контактов
		if (this.validateOrderContact()) {
			this.events.emit('Contact:ready', this.orderDetails);
		}
	}

	validateOrderPay() {
		const errors: typeof this.formErrors = {};
		if (!this.orderDetails.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.orderDetails.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateOrderContact() {
        const errors: typeof this.formErrors = {};
        if (!this.orderDetails.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.orderDetails.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactOrderErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

	clearOrder(): IOrderForm {
		return (this.orderDetails = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		});
	}

	getBasketItemCount(){
		return this.basket.length;
	}

	getTotalSummBasket(): number {
		return this.basket.reduce((total, product) => total + product.price, 0);
	}

	getBasketProductIDs = (): string[] => this.basket.map(item => item.id);

	addProductToBasket(product: IProduct) {
        this.basket.push(product);
        this.emitChanges('basket:updated');// Событие для обновления корзины
        this.emitChanges('itemCount:updated', this.getBasketItemCount);// Событие для обновления счетчика
	}

	
	removeProductFromBasket(item: IProduct) {
        this.basket = this.basket.filter((id) => id != item); // Удаляем товар по ID
        this.emitChanges('basket:updated'); // Событие для обновления корзины
        this.emitChanges('itemCount:updated', this.getBasketItemCount); // Обновляем счетчик
    }

	productInBasket(id: string) {
		return this.basket.some((item) => item.id === id);
	}

	handleProductAction = (action: 'add' | 'delete', item: IProduct) => {
		if (action === 'add') {
			this.addProductToBasket(item);
		} else if (action === 'delete') {
			this.removeProductFromBasket(item);
		}
	
}
}