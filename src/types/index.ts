// Интерфейс карточки товара в приложении
export interface IProduct {
   id: string;
   image: string;
   title: string;
   category: string;
   price: number | null;
   description: string;
   buttonText?: string;
}

// Интерфейс состояния всего приложения
export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrderForm | null;
    loading: boolean;
}

// Интерфейс для корзины с товаром
export interface IBasketView {
    title: string;
    total: number;
    index: string;
}

// Интерфейс для данных покупателя
export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

// Интерфейс для общих модалок
export interface IModalData {
    content: HTMLElement;
}

//Интерфейс состояния валидности формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}

//Интерфейс для отображения общей суммы заказа 
export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>

export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

